export interface NewActionBase {
  type: 'do' | 'say';
  actorName: string;
  timestamp: Date;
  description: string;
}

export interface ActionBase extends NewActionBase {
  id: string;
}
