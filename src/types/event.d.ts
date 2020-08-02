import { DisplaySkill } from './skill';
import { DisplayAttribute } from './attribute';

export interface Roll {
  attribute?: DisplayAttribute;
  dice?: number[];
  die?: number;
  requester: string;
  roller: string;
  skill?: DisplaySkill;
  skills: string[];
  effort?: number;
  direction?: 1 | -1;
  target: number | 'open';
}
