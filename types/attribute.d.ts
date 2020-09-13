export type PlayerAttributeName = 'might' | 'speed' | 'focus' | 'conviction';
export type CompanionAttributeName = 'loyalty' | 'health';
export type AttributeName = PlayerAttributeName | CompanionAttributeName;

export interface GenericAttribute {
  pool: number;
  edge: number;
  current: number;
  wound: boolean;
  name: AttributeName;
}

export interface Health extends GenericAttribute {
  name: 'health';
}

export interface Might extends GenericAttribute {
  name: 'might';
}

export interface Speed extends GenericAttribute {
  name: 'speed';
}

export interface Conviction extends GenericAttribute {
  name: 'conviction';
}

export interface Focus extends GenericAttribute {
  name: 'focus';
}

export interface Loyalty extends GenericAttribute {
  name: 'loyalty';
}

export type PlayerAttribute = Health | Might | Speed | Conviction | Focus;
export type CompanionAttribute = Health | Loyalty;
export type Attribute = PlayerAttribute | CompanionAttribute;
