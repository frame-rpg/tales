import { Acl } from './acl';

export type CharacterType = 'player' | 'nonplayer' | 'companion';

export interface NewCharacterBase {
  name: string;
  description: string;
  acl: Acl;
  type: CharacterType;
  campaign?: string;
  initiative: number;
}

export interface CharacterBase extends NewCharacterBase {
  id: string;
}
