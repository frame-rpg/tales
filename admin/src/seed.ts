import { campaign, campaignTemplate } from './campaign.js';
import {
  companionTemplate,
  nonplayerTemplate,
  playerTemplate,
} from './characterTemplates.js';
import { companions, players } from './characters.js';

import admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://tales-280319.firebaseio.com',
  projectId: 'tales-280319',
});

await app.firestore().doc('/rules/templates').set({
  player: playerTemplate,
  nonplayer: nonplayerTemplate,
  companion: companionTemplate,
  campaign: campaignTemplate,
});

await app.firestore().doc(`/campaigns/${campaign.id}`).set(campaign);

await Promise.all([
  Promise.all(
    players.map((p) => app.firestore().doc(`/characters/${p.id}`).set(p))
  ),
  Promise.all(
    companions.map((p) => app.firestore().doc(`/characters/${p.id}`).set(p))
  ),
]);
