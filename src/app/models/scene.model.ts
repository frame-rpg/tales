import { Acl } from './acl.model';

// scene hasmany Participants

export class Scene {
  name: string;
  id: string;
  acl: Acl;
}
