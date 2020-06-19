import { Acl } from './acl.model';

export class Attribute {
  maxPool: number;
  currentPool: number;
  edge: number;
  wound: boolean;
}

export class Skill {
  name: string;
  level: number;
  attributes: string[];
}

export class Character {
  id: string;
  name: string;
  description: string;
  acl: Acl;
  speed: Attribute;
  might: Attribute;
  focus: Attribute;
  conviction: Attribute;
  health: Attribute;
  skills: {
    [name: string]: Skill;
  };
}
