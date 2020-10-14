import { Ability } from './ability';

export interface Item {
  name: string;
  owner?: {
    campaignId: string;
    characterId: string;
    itemId: string;
  };
  description: string;
  slot: 'body' | 'hand' | 'head';
  size: number;
  abilities: Ability[];
  depleted?: boolean;
  equipped: boolean;
}
