import { Timestamp } from '@firebase/firestore-types';

export interface Page {
  id: string;
  content: string;
  published: boolean;
  updated: Timestamp | Date;
}
