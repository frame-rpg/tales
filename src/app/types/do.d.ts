import { ActionBase, NewActionBase } from './action_base';

export interface NewDo extends NewActionBase {
  type: 'do';
  roll: number;
  critical: boolean;
  initiative: number;
}

export interface Do extends NewDo {
  id: string;
}
