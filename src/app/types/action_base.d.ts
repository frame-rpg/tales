export interface ActionBase {
  id: string;
  type: 'do' | 'say';
  actorName: string;
  timestamp: Date;
  description: string;
}
