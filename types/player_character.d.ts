import { NewCharacterBase } from './character_base';
import { Attribute } from './attribute';
import { CharacterSkill } from './skill';

export interface NewPlayerCharacter extends NewCharacterBase {
  type: 'player';
  attributes: {
    speed: Attribute & { name: 'speed' };
    might: Attribute & { name: 'might' };
    focus: Attribute & { name: 'focus' };
    conviction: Attribute & { name: 'conviction' };
    health: Attribute & { name: 'health' };
  };
  skills: Record<string, CharacterSkill>;
  experience?: number;
}

export interface PlayerCharacter extends NewPlayerCharacter {
  id: string;
}
