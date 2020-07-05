import { AttributeNames } from './attribute';

export interface SkillDescription {
  name: string;
  description: string;
  preferredAttributes: AttributeNames[];
  allowedAttributes?: AttributeNames[];
  levelName?: string;
  level?: number;
}

type SkillDetails = Record<SkillNames, SkillDescription>;

export interface SkillLevels {
  [key: string]: string;
}

export type SkillNames =
  | 'advancedSecurity'
  | 'commandAnimal'
  | 'convictionDefense'
  | 'convictionMeleeAttack'
  | 'convictionRangedAttack'
  | 'dryScienceKnowledge'
  | 'dryScienceTinker'
  | 'focusDefense'
  | 'focusMeleeAttack'
  | 'focusRangedAttack'
  | 'hacking'
  | 'healthDefense'
  | 'initiative'
  | 'intimidate'
  | 'legerdemain'
  | 'lie'
  | 'medicine'
  | 'mightDefense'
  | 'mightMeleeAttack'
  | 'mightRangedAttack'
  | 'movement'
  | 'otherKnowledge'
  | 'perception'
  | 'persuade'
  | 'pickLocks'
  | 'piloting'
  | 'riding'
  | 'senseMotive'
  | 'sneaking'
  | 'speedDefense'
  | 'speedMeleeAttack'
  | 'speedRangedAttack'
  | 'swimming'
  | 'wetScienceKnowledge'
  | 'wetScienceTinker'
  | 'wildernessLore';
