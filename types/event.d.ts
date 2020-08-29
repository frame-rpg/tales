import { Skill } from './skill';
import { Attribute } from './attribute';

type RollState = 'requested' | 'rolled' | 'canceled' | 'finalized';

export interface BaseRoll {
  campaign: string;
  requester: string;
  roller: string;
  skills?: string[];
  type: 'initiative' | 'attack' | 'defend' | 'noncombat';
  target?: number;
  modifier: number;
  state: RollState;
}

export interface RequestedRoll extends BaseRoll {
  state: 'requested';
  id: string;
}

interface InflatedRoll extends BaseRoll {
  id: string;
  attribute: Attribute;
  dice: number[];
  die: number;
  skill: Skill;
  effort: number;
}

export interface RolledRoll extends InflatedRoll {
  state: 'rolled';
}

export interface FinalizedRoll extends InflatedRoll {
  state: 'finalized';
  result?: string;
}

export type Roll = RequestedRoll | RolledRoll | FinalizedRoll;
