import { Acl } from './acl';
import { Skill } from './skill';

export interface NewCampaign {
  acl: Acl;
  description: string;
  name: string;
  skills: Skill[];
  characters: string[];
}

export interface Campaign extends NewCampaign {
  id: string;
}
