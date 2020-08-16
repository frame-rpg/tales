import { NewCharacterBase } from './character_base';

export interface NewNonplayerCharacter extends NewCharacterBase {
  type: 'nonplayer';
  attack: number;
  defend: number;
  health: number;
  armor: number;
}

export interface NonplayerCharacter extends NewNonplayerCharacter {
  id: string;
}
