import { Acl } from './acl';
import { SkillNames } from './skill';

export interface NewCampaign {
  acl: Acl;
  description: string;
  name: string;
  skills: SkillNames[];
}

export interface Campaign extends NewCampaign {
  id: string;
}
