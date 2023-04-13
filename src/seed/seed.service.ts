import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {


  // constructor (
  //   private readonly axios:AxiosInstance,
  // ){}
  private readonly axios:AxiosInstance = axios;

  async exeuteSeed(){
    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    data.results.forEach(({name, url}) =>{

      const segments = url.split('/');
      const no:number = +segments[segments.length-1];
      

    })

    return data.results;
  }
}
