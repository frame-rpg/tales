import { Acl } from './acl';

export interface NewCampaign {
  acl: Acl;
  description: string;
  name: string;
  characters: string[];
}

export interface Campaign extends NewCampaign {
  id: string;
}
