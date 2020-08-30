export type PlayerAttributeName = 'might' | 'speed' | 'focus' | 'conviction';
export type CompanionAttributeName = 'loyalty' | 'health';
export type AttributeName = PlayerAttributeName | CompanionAttributeName;

export interface Attribute {
  pool: number;
  edge: number;
  current: number;
  wound: boolean;
  name: AttributeName;
}
