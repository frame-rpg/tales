import { Character } from './character';

export interface NewParticipant {
  name: string;
  initiative: number;
  character: Character;
  campaignId: string;
  sceneId: string;
}

export interface Participant extends NewParticipant {
  id: string;
}
