import { CharacterBase } from './character_base';
import { Speed, Might, Focus, Conviction, Health } from './attribute';
import { CharacterSkill } from './skill';

export interface PlayerCharacter extends CharacterBase {
  subtype: 'player';
  attributes: {
    speed: Speed;
    might: Might;
    focus: Focus;
    conviction: Conviction;
    health: Health;
  };
  skills: CharacterSkill[];
  experience?: number;
}
