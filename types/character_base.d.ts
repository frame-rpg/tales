import { Acl } from './acl';
import { Action } from './action';
import { Equipment } from './equipment';
import { CampaignId, CharacterId } from './idtypes';

export type CharacterType = 'player' | 'nonplayer' | 'companion';

export interface CharacterBase extends CharacterId {
  name: string;
  description: string;
  acl: Acl;
  subtype: CharacterType;
  initiative: number;
  equipment: Equipment[];
  abilities: Action[];
}
