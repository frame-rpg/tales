import { Acl } from './acl';
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
}
