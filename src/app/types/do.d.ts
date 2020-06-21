import { ActionBase } from './action_base';

export interface Do extends ActionBase {
  type: 'do';
  roll: number;
  critical: boolean;
  initiative: number;
}
