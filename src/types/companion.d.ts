import { NewCharacterBase } from './character_base';
import { CharacterAttribute } from './attribute';

export interface NewCompanion extends NewCharacterBase {
  type: 'companion';
  attack: number;
  defend: number;
  attributes: {
    health: CharacterAttribute;
    loyalty: CharacterAttribute;
  };
  armor: number;
  skills: {
    [name: string]: number;
  };
  abilities: string[];
}

export interface Companion extends NewCompanion {
  id: string;
}
