import { Acl } from './acl';

export type CharacterTypes = 'player' | 'nonplayer' | 'companion';

export interface NewCharacterBase {
  name: string;
  description: string;
  acl: Acl;
  type: CharacterTypes;
}

export interface CharacterBase extends NewCharacterBase {
  id: string;
}
