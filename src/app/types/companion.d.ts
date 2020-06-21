import { CharacterBase } from './character_base';
import { Attribute } from './player_character';

export interface Companion extends CharacterBase {
  type: 'companion';
  attack: number;
  defend: number;
  health: Attribute;
  loyalty: Attribute;
  armor: number;
}
