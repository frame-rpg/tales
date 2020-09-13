import { Timestamp } from '@firebase/firestore-types';

import { SkillType, CharacterSkill } from './skill';
import { AttributeName } from './attribute';
import { Id } from './idtypes';

export type MessageType = 'rollRequest' | 'rollComplete' | 'say';
export type MessageTarget = 'campaign' | 'character';
export type MessageState = 'new' | 'viewed' | 'archived';

export interface BaseMessage {
  messageId: string;
  messageType: MessageType;
  state: MessageState;
  to: Id;
  from: Id;
  description: string;
  at: Date | Timestamp;
}

export interface RollRequest extends BaseMessage {
  messageType: 'rollRequest';
  type: SkillType;
  skillModifier: number;
  conditionalEdge: number;
  skills?: string[];
  target?: number;
  damage?: number;
  attributes?: AttributeName[];
}

export interface RollComplete extends BaseMessage {
  messageType: 'rollComplete';
  skill: CharacterSkill;
  attribute: string;
  result: number;
  effort: number;
  success?: boolean;
}

export interface Say extends BaseMessage {
  messageType: 'say';
}

export type Message = RollRequest | RollComplete | Say;
