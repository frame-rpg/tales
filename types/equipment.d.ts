export interface EquipmentBase {
  type: 'weapon' | 'armor' | 'other';
  name: string;
  slot: 'hand' | 'body' | 'other';
  size: number;
}

export interface Weapon extends EquipmentBase {
  type: 'weapon';
  kind: 'melee' | 'ranged';
  skills: string[];
  damage: number;
  initiative: number;
  assets: number;
  edge: number;
}

export interface Armor extends EquipmentBase {
  type: 'armor';
  edge: number;
  assets: number;
}

export interface OtherItem extends EquipmentBase {
  type: 'other';
}

export type Equipment = Weapon | Armor | OtherItem;
