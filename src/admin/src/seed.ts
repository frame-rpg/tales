import { COMPANIONS, PLAYERS } from './characters.js';
import {
  COMPANION_TEMPLATE,
  NONPLAYER_TEMPLATE,
  PLAYER_TEMPLATE,
} from './characterTemplates.js';
import { skillLevelSeed, skillSeed } from './skills.js';

import admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://stubgrub-10a8b.firebaseio.com',
});

await app.firestore().doc('/rules/skills').set(skillSeed);
await app.firestore().doc('/rules/skillLevels').set(skillLevelSeed);
await app.firestore().doc('/rules/characterTemplates').set({
  player: PLAYER_TEMPLATE,
  nonplayer: NONPLAYER_TEMPLATE,
  companion: COMPANION_TEMPLATE,
});

const newCampaign = await app
  .firestore()
  .collection('/campaigns')
  .add({
    name: 'Tales of Dinosaurs and Stuff',
    description: 'also Time Travel and Alien Spaceships',
    acl: {
      'eric.eslinger@gmail.com': 'admin',
      'albertel@gmail.com': 'read',
      'malbertelli@gmail.com': 'read',
      'llahwehttam@gmail.com': 'read',
      'guy@albertelli.com': 'read',
      'megan@albertelli.com': 'read',
      'chrissy.jacobs@sfuhs.org': 'read',
      'phil.bowen@gmail.com': 'read',
      'cljacobs1975@gmail.com': 'read',
    },
  });

await Promise.all(
  PLAYERS.map((p) =>
    app.firestore().collection(`/campaigns/${newCampaign.id}/characters`).add(p)
  )
);

await Promise.all(
  COMPANIONS.map((p) =>
    app.firestore().collection(`/campaigns/${newCampaign.id}/characters`).add(p)
  )
);
