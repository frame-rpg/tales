import { Acl } from './acl';

export interface NewCharacterBase {
  name: string;
  description: string;
  acl: Acl;
  type: 'player' | 'nonplayer' | 'companion';
}

export interface CharacterBase extends NewCharacterBase {
  id: string;
}
