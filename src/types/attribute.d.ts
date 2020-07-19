export type PlayerAttributeNames = 'might' | 'speed' | 'focus' | 'conviction';
export type CompanionAttributeNames = 'loyalty' | 'health';
export type AttributeNames = PlayerAttributeNames | CompanionAttributeNames;

export interface CharacterAttribute {
  pool: number;
  edge: number;
}

export interface DisplayAttribute extends CharacterAttribute {
  wound: boolean;
  current: number;
  name: string;
}
