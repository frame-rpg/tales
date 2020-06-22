import { NewCharacterBase } from './character_base';
import { Attribute } from './player_character';

export interface NewCompanion extends NewCharacterBase {
  type: 'companion';
  attack: number;
  defend: number;
  health: Attribute;
  loyalty: Attribute;
  armor: number;
}

export interface Companion extends NewCompanion {
  id: string;
}
