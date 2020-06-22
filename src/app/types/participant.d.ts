import { Character } from './character';

export interface NewParticipant {
  name: string;
  initiative: number;
  character: Character;
}

export interface Participant extends NewParticipant {
  id: string;
}
