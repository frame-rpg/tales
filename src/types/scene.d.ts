import { Acl } from './acl';

export interface NewScene {
  name: string;
  description: string;
  active: boolean;
  campaignId: string;
}

export interface Scene {
  id: string;
}
