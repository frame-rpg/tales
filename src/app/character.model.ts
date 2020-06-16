export class CharacterAttribute {
  maxPool: number;
  currentPool: number;
  edge: number;
  wound: boolean;
}

export class Character {
  id: String;
  name: String;
  description: String;
  speed: CharacterAttribute;
  might: CharacterAttribute;
  focus: CharacterAttribute;
  conviction: CharacterAttribute;
  health: CharacterAttribute;
}
