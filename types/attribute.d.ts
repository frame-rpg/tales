export type PlayerAttributeNames = 'might' | 'speed' | 'focus' | 'conviction';
export type CompanionAttributeNames = 'loyalty' | 'health';
export type AttributeNames = PlayerAttributeNames | CompanionAttributeNames;

export interface Attribute {
  pool: number;
  edge: number;
  current: number;
  wound: boolean;
  name: AttributeNames;
}
