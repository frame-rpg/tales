import { Acl } from './acl';
import { CampaignId } from './idtypes';
import { Skill } from './skill';

export interface Campaign extends CampaignId {
  acl: Acl;
  description: string;
  name: string;
  skills: Skill[];
}
