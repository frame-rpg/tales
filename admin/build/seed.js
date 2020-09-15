import { campaign as dinoCampaign, characters as dinoCharacters, } from './dino.js';
import { campaign as ffCampaign, characters as ffCharacters, } from './fantasyFights.js';
import admin from 'firebase-admin';
(async () => {
    const app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://tales-280319.firebaseio.com',
        projectId: 'tales-280319',
    });
    const dc = await app.firestore().collection(`/campaigns`).add(dinoCampaign);
    const ffc = await app.firestore().collection(`/campaigns`).add(ffCampaign);
    await Promise.all([
        Promise.all(dinoCharacters.map((p) => app
            .firestore()
            .collection(`/campaigns/${dc.id}/characters`)
            .add({ ...p, campaignId: dc.id }))),
        Promise.all(ffCharacters.map((p) => app
            .firestore()
            .collection(`/campaigns/${ffc.id}/characters`)
            .add({ ...p, campaignId: ffc.id }))),
    ]);
})();
