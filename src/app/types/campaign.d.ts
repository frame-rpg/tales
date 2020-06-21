import { Acl } from './acl';

export interface Campaign {
  acl: Acl;
  id: string;
  description: string;
  name: string;
}
