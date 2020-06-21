import { CharacterBase } from './character_base';

export interface Attribute {
  maxPool: number;
  currentPool: number;
  edge: number;
  wound: boolean;
}

export interface Skill {
  name: string;
  level: number;
  attributes: string[];
}

export interface PlayerCharacter extends CharacterBase {
  type: 'player';
  speed: Attribute;
  might: Attribute;
  focus: Attribute;
  conviction: Attribute;
  health: Attribute;
  skills: {
    [name: string]: Skill;
  };
}
