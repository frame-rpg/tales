import { Module } from '@nestjs/common';
import { CharacterController } from './character/character.controller';

@Module({
  controllers: [CharacterController],
})
export class AppModule {}
