import { AttributeNames } from './attribute';

export interface SkillDescription {
  name: string;
  description: string;
  attributes: AttributeNames[];
  levelName?: string;
  level?: number;
}

type SkillDetails = Record<SkillNames, SkillDescription>;

export interface SkillLevels {
  [key: string]: string;
}

export interface DisplaySkill {
  id: string;
  name: string;
  levelName: string;
  level: number;
  description: string;
  attributes: AttributeNames[];
}

export type SkillNames =
  | 'advancedsecurity'
  | 'commandanimal'
  | 'convictiondefense'
  | 'convictionmeleeattack'
  | 'convictionrangedattack'
  | 'dryscienceknowledge'
  | 'drysciencetinker'
  | 'focusdefense'
  | 'focusmeleeattack'
  | 'focusrangedattack'
  | 'hacking'
  | 'healthdefense'
  | 'initiative'
  | 'intimidate'
  | 'legerdemain'
  | 'lie'
  | 'medicine'
  | 'mightdefense'
  | 'mightmeleeattack'
  | 'mightrangedattack'
  | 'movement'
  | 'otherknowledge'
  | 'perception'
  | 'persuade'
  | 'picklocks'
  | 'piloting'
  | 'riding'
  | 'sensemotive'
  | 'sneaking'
  | 'speeddefense'
  | 'speedmeleeattack'
  | 'speedrangedattack'
  | 'swimming'
  | 'wetscienceknowledge'
  | 'wetsciencetinker'
  | 'wildernesslore';
