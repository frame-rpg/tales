import { Cost } from './cost';
import { Effect } from './effect';
import { SkillType } from './skill';

export type AbilityType = 'action' | 'replace' | 'modifier' | 'passive';

export interface Ability {
  type: AbilityType;
  effects: Effect[];
  costs: Cost[];
  name: string;
  description: string;
  category: SkillType;
  skills?: string[];
  from?: {
    characterId: string;
    campaignId: string;
    itemId: string;
  };
}
