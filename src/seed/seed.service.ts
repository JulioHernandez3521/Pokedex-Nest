import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {


  constructor (
    private readonly pokemonService:PokemonService,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter, 

  ){}



  async exeuteSeed(){

    await this.pokemonService.removeAll();

    const data  = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=50`);

    const pokemonInserts: {name:string, no:number}[] = data.results.map(({name, url}) =>{

      const segments = url.split('/');
      const no:number = +segments[segments.length-2];
      
      const poke : CreatePokemonDto = { name , no};
      
      return poke;

    })

    try {
      
      await this.pokemonModel.insertMany(pokemonInserts);
      
      return `Seed executed "${pokemonInserts.length}" inserted rows`;

    } catch (error) {
      console.log(error);
    }
  }
}
