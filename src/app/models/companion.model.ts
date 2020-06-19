import { Attribute } from './character.model';
import { Acl } from './acl.model';

export class Companion {
  id: string;
  name: string;
  armor: number;
  defense: number;
  attack: number;
  ornery: number;
  character: string;
  acl: Acl;
  loyalty: Attribute;
  health: Attribute;
}
