export interface CategoricalModifier {
  category: string;
  value: number;
}
export interface Effect {
  assets?: CategoricalModifier[];
  edge?: CategoricalModifier[];
  initiative?: number;
}

export interface EquipmentBase {
  type: 'weapon' | 'armor' | 'other';
  name: string;
  slot: 'hand' | 'body' | 'other';
  size: number;
  equipped: boolean;
  effect: Effect;
}

export interface Weapon extends EquipmentBase {
  type: 'weapon';
  kind: 'melee' | 'ranged';
  skills: string[];
  damage: number;
  initiative: number;
}

export interface Armor extends EquipmentBase {
  type: 'armor';
}

export interface OtherItem extends EquipmentBase {
  type: 'other';
}

export type Equipment = Weapon | Armor | OtherItem;
