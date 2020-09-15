import { AttributeName } from './attribute';

declare enum Level {
  inept = -2,
  unskilled = -1,
  proficient = 0,
  trained = 1,
  expert = 2,
}
export type LevelName = keyof typeof Level;
export type SkillType =
  | 'initiative'
  | 'attack'
  | 'defense'
  | 'noncombat'
  | 'health';

export type SkillCategory =
  | 'melee'
  | 'ranged'
  | 'defense'
  | 'initiative'
  | 'movement'
  | 'deception'
  | 'adventuring'
  | 'magic'
  | 'knowledge';

export interface Skill {
  skillId: string;
  name: string;
  description: string;
  attributes: AttributeName[];
  type: SkillType;
  category: SkillCategory;
}

export interface CharacterSkill extends Skill {
  level: LevelName;
}
