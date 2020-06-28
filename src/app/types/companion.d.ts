import { NewCharacterBase } from './character_base';
import { Attribute, SkillNames } from './player_character';

export interface NewCompanion extends NewCharacterBase {
  type: 'companion';
  attack: number;
  defend: number;
  health: Attribute;
  loyalty: Attribute;
  armor: number;
  skills: {
    [name in SkillNames]?: number;
  };
}

export interface Companion extends NewCompanion {
  id: string;
}
