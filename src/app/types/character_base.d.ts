import { Acl } from './acl';

export interface CharacterBase {
  id: string;
  name: string;
  description: string;
  acl: Acl;
  type: 'player' | 'nonplayer' | 'companion';
}
