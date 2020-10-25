import { CampaignId, CharacterId } from './idtypes';
import { Timestamp } from '@firebase/firestore-types';

export interface Note {
  noteId: string;
  parentId: CharacterId | CampaignId;
  title: string;
  content: string;
  updatedAt: Date | Timestamp;
}
