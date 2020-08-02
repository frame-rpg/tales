import { DisplaySkill } from './skill';
import { DisplayAttribute } from './attribute';

export interface Roll {
  attribute?: DisplayAttribute;
  dice?: number[];
  requester: string;
  roller: string;
  skill?: DisplaySkill;
  skills: string[];
  effort?: number;
  target: number | 'open';
}
