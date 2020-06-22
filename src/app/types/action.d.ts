import { Do, NewDo } from './do';
import { Say, NewSay } from './say';

export type Action = Do | Say;
export type NewAction = NewDo | NewSay;
