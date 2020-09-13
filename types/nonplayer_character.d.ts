import { CharacterBase } from './character_base';

export interface NonplayerCharacter extends CharacterBase {
  subtype: 'nonplayer';
  attack: number;
  defend: number;
  health: number;
  armor: number;
  baseInitiative: number;
}
