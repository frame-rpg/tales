import { NewActionBase } from './action_base';

export interface NewSay extends NewActionBase {
  type: 'say';
}

export interface Say extends NewSay {
  id: string;
}
