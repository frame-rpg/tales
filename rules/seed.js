const fs = require('fs');
const admin = require('firebase-admin');

async function seed() {
  const basic = fs.readFileSync('basic.md');

  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://framesystem-rpg.firebaseio.com',
    projectId: 'framesystem-rpg',
  });

  await app
    .firestore()
    .doc('/pages/rules')
    .set({
      authors: ['eric'],
    });

  await app.firestore().doc('/pages/rules/pages/basic').set({
    published: true,
    sequence: 1,
    updated: new Date(),
    pageId: 'basic',
    collectionId: 'rules',
    content: basic.toString(),
  });
}
try {
  seed();
} catch (e) {
  console.log(e);
}
