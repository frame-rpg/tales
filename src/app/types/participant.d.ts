import { Character } from './character';

export interface Participant {
  id: string;
  name: string;
  initiative: number;
  character: Character;
}
