import {
  COMPANION_TEMPLATE,
  NONPLAYER_TEMPLATE,
  PLAYER_TEMPLATE,
} from './characterTemplates.js';
import { skillLevelSeed, skillSeed } from './skills.js';

import admin from 'firebase-admin';
import serviceAccount from './keys/secret.json';

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://tales-280319.firebaseio.com',
});

await app.firestore().doc('/rules/skills').set(skillSeed);
await app.firestore().doc('/rules/skillLevels').set(skillLevelSeed);
await app.firestore().doc('/rules/characterTemplates').set({
  player: PLAYER_TEMPLATE,
  nonplayer: NONPLAYER_TEMPLATE,
  companion: COMPANION_TEMPLATE,
});
