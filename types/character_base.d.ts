import { Acl } from './acl';

export type CharacterType = 'player' | 'nonplayer' | 'companion';

export interface CharacterBase {
  type: 'character';
  characterId: string;
  userId?: string;
  campaignId?: string;
  name: string;
  description: string;
  acl: Acl;
  subtype: CharacterType;
  campaign?: string;
  initiative: number;
  parent: 'user' | 'campaign';
}
