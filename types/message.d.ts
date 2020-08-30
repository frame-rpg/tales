import { SkillType, CharacterSkill } from './skill';
import { AttributeName } from './attribute';

export type MessageType = 'rollRequest' | 'rollComplete' | 'say';
export type MessageTarget = 'campaign' | 'character';
export type MessageState = 'new' | 'viewed' | 'archived';

export interface MessageAddress {
  type: 'campaign' | 'character';
  id: string;
}

export interface BaseMessage {
  messageType: MessageType;
  state: MessageState;
  to: MessageAddress;
  from: MessageAddress;
}

export interface RollRequest extends BaseMessage {
  messageType: 'rollRequest';
  type: SkillType;
  skillModifier?: number;
  conditionalEdge?: number;
  skills?: string[];
  attributes?: AttributeName[];
}

export interface RollComplete extends BaseMessage {
  messageType: 'rollComplete';
  skill: CharacterSkill;
  pool?: number;
  success?: boolean;
  description: string;
}

export interface Say extends BaseMessage {
  messageType: 'say';
}

export type Message = RollRequest | RollComplete | Say;

export type SentMessage = Message & { id: string };
