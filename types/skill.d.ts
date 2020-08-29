import { AttributeNames } from './attribute';

export enum Levels {
  inept = -2,
  unskilled = -1,
  proficient = 0,
  trained = 1,
  expert = 2,
}

export type LevelNames = keyof typeof Levels;

export interface Skill {
  id: string;
  name: string;
  description: string;
  attributes: AttributeNames[];
  type: 'initiative' | 'attack' | 'defense' | 'noncombat';
}

export interface CharacterSkill extends Skill {
  level: LevelNames;
}
