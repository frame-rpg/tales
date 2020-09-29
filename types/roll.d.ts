import { Timestamp } from '@firebase/firestore-types';
import { Equipment } from './equipment';
import { CharacterId } from './idtypes';
import { SkillType } from './skill';

export type RollState = 'requested' | 'rolled';

export interface RollMetadata {
  state: RollState;
  messageId: string;
  roller: CharacterId;
  at: Date | Timestamp;
  archive: boolean;
}

export interface BasicRoll {
  type: SkillType;
  assets: number;
  edge: number;
  items: Equipment[];
}

export interface Initiative extends BasicRoll {
  type: 'initiative';
}

export interface Defense extends BasicRoll {
  type: 'defense';
  target: number;
  damage: number;
}

export interface Health extends BasicRoll {
  type: 'health';
  target: number;
  attribute: string;
}

export interface Noncombat extends BasicRoll {
  type: 'noncombat';
  target?: number;
  initiative: number;
  skills: string[];
}

export interface Attack extends BasicRoll {
  type: 'attack';
  target?: number;
  initiative: number;
  damage: number;
}

export interface BasicRequest {
  state: 'requested';
}

export interface BasicComplete {
  state: 'rolled';
  success?: boolean;
  result: number;
  effort: number;
  critical: boolean;
}

export type InitiativeRequest = Initiative & BasicRequest & RollMetadata;
export type DefenseRequest = Defense & BasicRequest & RollMetadata;
export type AttackRequest = Attack & BasicRequest & RollMetadata;
export type NoncombatRequest = Noncombat & BasicRequest & RollMetadata;
export type HealthRequest = Health & BasicRequest & RollMetadata;

export type InitiativeComplete = Initiative & BasicComplete & RollMetadata;
export type DefenseComplete = Defense & BasicComplete & RollMetadata;
export type AttackComplete = Attack & BasicComplete & RollMetadata;
export type NoncombatComplete = Noncombat & BasicComplete & RollMetadata;
export type HealthComplete = Health & BasicComplete & RollMetadata;

export type RollRequest =
  | InitiativeRequest
  | DefenseRequest
  | AttackRequest
  | NoncombatRequest
  | HealthRequest;

export type RollComplete =
  | InitiativeComplete
  | DefenseComplete
  | AttackComplete
  | NoncombatComplete
  | HealthComplete;
