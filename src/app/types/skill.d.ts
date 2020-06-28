import { AttributeNames } from './attribute';

export interface SkillDescription {
  name: string;
  description: string;
  attributes: AttributeNames[];
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
