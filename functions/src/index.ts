import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { postRoll } from './postRoll';

admin.initializeApp();
const db = admin.firestore();

export const onRoll = functions.firestore
  .document('/rolls/{rollId}')
  .onUpdate((change, context) => postRoll(change, db));
