import {
  COMPANION_TEMPLATE,
  NONPLAYER_TEMPLATE,
  PLAYER_TEMPLATE,
} from './characterTemplates.js';
import { skillLevelSeed, skillSeed } from './skills.js';

import admin from 'firebase-admin';

let app: admin.app.App;

if (process.env.FIRESTORE_EMULATOR_HOST) {
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'stubgrub-10a8b',
  });
} else {
  // Running remotely, requires a real credential;
  const serviceAccount = await require('./keys/secret.json');
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://stubgrub-10a8b.firebaseio.com',
  });
}

await app.firestore().doc('/rules/skills').set(skillSeed);
await app.firestore().doc('/rules/skillLevels').set(skillLevelSeed);
await app.firestore().doc('/rules/characterTemplates').set({
  player: PLAYER_TEMPLATE,
  nonplayer: NONPLAYER_TEMPLATE,
  companion: COMPANION_TEMPLATE,
});
