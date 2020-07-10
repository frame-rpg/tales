import { campaign, campaignTemplate } from './campaign.js';
import {
  companionTemplate,
  nonplayerTemplate,
  playerTemplate,
} from './characterTemplates.js';
import { companions, players } from './characters.js';
import { skillLevelSeed, skillSeed } from './skills.js';
import { updateAcl, users } from './users.js';

import admin from 'firebase-admin';

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://tales-280319.firebaseio.com',
  projectId: 'tales-280319',
});

await app.firestore().doc('/rules/skills').set(skillSeed);
await app.firestore().doc('/rules/skillLevels').set(skillLevelSeed);
await app.firestore().doc('/rules/templates').set({
  player: playerTemplate,
  nonplayer: nonplayerTemplate,
  companion: companionTemplate,
  campaign: campaignTemplate,
});

await app.firestore().doc(`/campaigns/${campaign.id}`).set(updateAcl(campaign));

await Promise.all([
  Promise.all(
    users.map((user) => app.firestore().doc(`/users/${user.id}`).set(user))
  ),
  Promise.all(
    players
      .map(updateAcl)
      .map((p) =>
        app
          .firestore()
          .doc(`/campaigns/${campaign.id}/characters/${p.id}`)
          .set(p)
      )
  ),
  Promise.all(
    companions
      .map(updateAcl)
      .map((p) =>
        app
          .firestore()
          .doc(`/campaigns/${campaign.id}/characters/${p.id}`)
          .set(p)
      )
  ),
]);
