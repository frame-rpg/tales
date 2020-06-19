export interface Do {
  actor: {
    id: string;
    image: string;
    name: string;
    type: 'character';
  };
  id: string;
  timestamp: Date;
  type: 'do';
}

export interface Say {
  actor: {
    id: string;
    image: string;
    name: string;
    type: 'player' | 'character';
  };
  id: string;
  timestamp: Date;
  type: 'say';
}

export type Action = Do | Say;
