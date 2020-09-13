import { companions, players } from './characters.js';

import admin from 'firebase-admin';
import { campaign } from './campaign.js';

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://tales-280319.firebaseio.com',
  projectId: 'tales-280319',
});

const c1 = await app.firestore().collection(`/campaigns`).add(campaign);

await Promise.all([
  Promise.all(
    players.map((p) =>
      app
        .firestore()
        .collection(`/campaigns/${c1.id}/characters`)
        .add({ ...p, campaignId: c1.id })
    )
  ),
  Promise.all(
    companions.map((p) =>
      app
        .firestore()
        .collection(`/campaigns/${c1.id}/characters`)
        .add({ ...p, campaignId: c1.id })
    )
  ),
]);
