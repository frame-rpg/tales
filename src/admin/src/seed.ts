import { campaign, campaignTemplate } from './campaign.js';
import {
  companionTemplate,
  nonplayerTemplate,
  playerTemplate,
} from './characterTemplates.js';
import { companions, players } from './characters.js';
import { skillLevelSeed, skillSeed } from './skills.js';

import admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://stubgrub-10a8b.firebaseio.com',
});

await app.firestore().doc('/rules/skills').set(skillSeed);
await app.firestore().doc('/rules/skillLevels').set(skillLevelSeed);
await app.firestore().doc('/rules/templates').set({
  player: playerTemplate,
  nonplayer: nonplayerTemplate,
  companion: companionTemplate,
  campaign: campaignTemplate,
});

const newCampaign = await app
  .firestore()
  .collection('/campaigns')
  .add(campaign);

await Promise.all([
  Promise.all(
    players.map((p) =>
      app
        .firestore()
        .collection(`/campaigns/${newCampaign.id}/characters`)
        .add(p)
    )
  ),
  Promise.all(
    companions.map((p) =>
      app
        .firestore()
        .collection(`/campaigns/${newCampaign.id}/characters`)
        .add(p)
    )
  ),
]);
