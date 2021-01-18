import { Module, NestModule } from '@nestjs/common';

import { CharacterController } from './character/character.controller';

@Module({
  controllers: [CharacterController],
})
export class AppModule implements NestModule {
  configure() {}
}
