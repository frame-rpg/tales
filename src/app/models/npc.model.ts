import { Acl } from './acl.model';

export class Npc {
  id: string;
  name: string;
  health: number;
  damage: number;
  defense: number;
  attack: number;
  acl: Acl;
}
