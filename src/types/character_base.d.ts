import { Acl } from './acl';
import { AttributeNames } from './attribute';

export type CharacterTypes = 'player' | 'nonplayer' | 'companion';

export interface NewCharacterBase {
  name: string;
  description: string;
  acl: Acl;
  type: CharacterTypes;
  campaign?: string;
  status: Status;
}

export interface Status {
  experience?: number;
  initiative?: number;
  pools?: {
    [k in AttributeNames]?: {
      current: number;
      wound: boolean;
    };
  };
}

export interface CharacterBase extends NewCharacterBase {
  id: string;
}
