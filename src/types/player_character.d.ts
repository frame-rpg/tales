import { NewCharacterBase } from './character_base';
import { CharacterAttribute } from './attribute';

export interface NewPlayerCharacter extends NewCharacterBase {
  type: 'player';
  attributes: {
    speed: CharacterAttribute;
    might: CharacterAttribute;
    focus: CharacterAttribute;
    conviction: CharacterAttribute;
    health: CharacterAttribute;
  };
  skills: {
    [name: string]: number;
  };
}

export interface PlayerCharacter extends NewPlayerCharacter {
  id: string;
}
