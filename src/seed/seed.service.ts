import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {


  constructor (
    private readonly pokemonService:PokemonService,
  ){}
  private readonly axios:AxiosInstance = axios;


  async exeuteSeed(){
    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=50`);
    


    const pokemonPromesas = data.results.map(({name, url}) =>{

      const segments = url.split('/');
      const no:number = +segments[segments.length-2];
      // console.log(segments)
      const poke : CreatePokemonDto = { name , no};
      // console.log(poke)
      return this.pokemonService.create(poke);

    })

    try {
      
      await Promise.all(pokemonPromesas);
      return `Seed executed "${pokemonPromesas.length}" inserted rows`;

    } catch (error) {
      console.log(error);
    }
  }
}
