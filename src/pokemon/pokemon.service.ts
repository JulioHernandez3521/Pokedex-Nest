import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> 
  ){}
  


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      
      this.handleExceptions(error)

    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(termino: string) : Promise<Pokemon> {
    let pokemon : Pokemon;

    if(!isNaN(+termino)){
      pokemon = await this.pokemonModel.findOne({no: termino});
    }

    if(!pokemon && isValidObjectId(termino)){
      pokemon = await this.pokemonModel.findById(termino);
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: termino.toLocaleLowerCase()});
    }


    if(!pokemon) throw new NotFoundException(`The pokemon with Id or Name or No ${termino} not found`);

    return pokemon
  }

  async update(termino: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon : Pokemon = await this.findOne(termino);
    
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {

      const  p = await pokemon.updateOne(updatePokemonDto,)
      return {...p.toJSON, ...updatePokemonDto};
      
    } catch (error) {
      this.handleExceptions(error)
    }
      

    
  }

  async remove(id: string) {
      const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});

      if(deletedCount === 0 )
        throw new BadRequestException(`Pokemon with id ${id} not found`);

      return;
  }

  async removeAll() {
    const {deletedCount} = await this.pokemonModel.deleteMany();
    return `All is clean`;
}
  private handleExceptions(error:any ){
    if(error.code === 11000) throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`);

    console.log(error)
    throw new InternalServerErrorException(`Can't create Pokemon something is worng see the logs`)
  }
}
