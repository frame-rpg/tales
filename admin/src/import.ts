import * as admin from 'firebase-admin';
import * as fs from 'fs';
(async () => {
  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://framesystem-rpg.firebaseio.com',
    projectId: 'framesystem-rpg',
  });

  const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

  await Promise.all(
    Object.entries(data.pages).map(async ([id, page]) => {
      await app
        .firestore()
        .doc(`/pages/${id}`)
        .set((page as any).meta);
      await Promise.all(
        (page as any).content.map((child: any) =>
          app.firestore().doc(`/pages/${id}/pages/${child.id}`).set(child)
        )
      );
    })
  );

  await Promise.all(
    Object.entries(data.campaigns).map(async ([id, campaign]) => {
      await app
        .firestore()
        .doc(`/campaigns/${id}`)
        .set((campaign as any).campaign);
      await Promise.all(
        (campaign as any).characters.map((character: any) =>
          app
            .firestore()
            .doc(`/campaigns/${id}/characters/${character.characterId}`)
            .set(character)
        )
      );
    })
  );
})();