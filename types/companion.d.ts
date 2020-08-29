import { NewCharacterBase } from './character_base';
import { Attribute } from './attribute';
import { LevelNames } from './skill';

export interface NewCompanion extends NewCharacterBase {
  type: 'companion';
  attack: number;
  defend: number;
  baseInitiative: number;
  attributes: {
    health: Attribute & { name: 'health' };
    loyalty: Attribute & { name: 'loyalty' };
  };
  armor: number;
  skills: {
    [name: string]: LevelNames;
  };
  abilities: string[];
}

export interface Companion extends NewCompanion {
  id: string;
}
