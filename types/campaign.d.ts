import { Acl } from './acl';
import { Skill } from './skill';

export interface Campaign {
  acl: Acl;
  description: string;
  name: string;
  skills: Skill[];
  characters: string[];
}
