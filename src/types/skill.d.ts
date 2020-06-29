import { AttributeNames } from './attribute';

export interface SkillDescription {
  name: string;
  description: string;
  attributes: AttributeNames[];
  levelName?: string;
  level?: number;
}

export interface SkillDetails {
  [key: string]: SkillDescription;
}

export interface SkillLevels {
  [key: string]: string;
}

export type SkillNames =
  | 'movement'
  | 'riding'
  | 'piloting'
  | 'swimming'
  | 'sneaking'
  | 'wildernessLore'
  | 'medicine'
  | 'commandAnimal'
  | 'perception'
  | 'wetScienceKnowledge'
  | 'wetScienceTinker'
  | 'dryScienceKnowledge'
  | 'dryScienceTinker'
  | 'persuade'
  | 'lie'
  | 'senseMotive'
  | 'legerdemain'
  | 'hacking'
  | 'pickLocks'
  | 'advancedSecurity';
