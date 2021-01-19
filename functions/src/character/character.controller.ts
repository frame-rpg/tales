import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Character } from '../../../types/character';

@Controller('character')
export class CharacterController {
  @Get() findAll(): string {
    return 'hi';
  }
  @Post() async create(@Req() request: Request): Promise<string> {
    const char = request.body as Character;
    console.log(char);
    return Promise.resolve('');
  }
}
