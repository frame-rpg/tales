import { DisplaySkill } from './skill';
import { DisplayAttribute } from './attribute';

type RollState = 'requested' | 'rolled' | 'canceled' | 'finalized';

export interface BaseRoll {
  campaign: string;
  requester: string;
  roller: string;
  skills: string[];
  target: number | 'open';
  state: RollState;
}

export interface RequestedRoll extends BaseRoll {
  id: string;
  state: 'requested';
}

export interface RolledRoll extends BaseRoll {
  id: string;
  attribute: DisplayAttribute;
  campaign: string;
  dice: number[];
  die: number;
  requester: string;
  roller: string;
  skill: DisplaySkill;
  skills: string[];
  effort: number;
  target: number | 'open';
  state: 'rolled';
}

export interface FinalizedRoll extends BaseRoll {
  id: string;
  attribute: DisplayAttribute;
  campaign: string;
  dice: number[];
  die: number;
  requester: string;
  roller: string;
  skill: DisplaySkill;
  skills: string[];
  effort: number;
  target: number | 'open';
  result: string;
  state: 'finalized';
}

export type Roll = RequestedRoll | RolledRoll | FinalizedRoll;
