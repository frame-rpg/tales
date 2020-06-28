import { NewCharacterBase } from './character_base';

export interface Attribute {
  maxPool: number;
  currentPool: number;
  edge: number;
  wound: boolean;
}

export interface NewPlayerCharacter extends NewCharacterBase {
  type: 'player';
  speed: Attribute;
  might: Attribute;
  focus: Attribute;
  conviction: Attribute;
  health: Attribute;
  skills: {
    [name in SkillNames]?: number;
  };
}

export interface PlayerCharacter extends NewPlayerCharacter {
  id: string;
}

export type AttributeNames = 'might' | 'speed' | 'focus' | 'conviction';
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

export interface SkillDescription {
  name: string;
  description: string;
  attributes: AttributeNames[];
}
