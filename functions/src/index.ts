import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

export const onSignup = functions.auth.user().onCreate(async (user) => {
  const importedUsers = [
    'eric.eslinger@gmail.com',
    'albertel@gmail.com',
    'malbertelli@gmail.com',
    'llahwehttam@gmail.com',
    'guy@albertelli.com',
    'megan@albertelli.com',
    'chrissy.jacobs@sfuhs.org',
    'phil.bowen@gmail.com',
    'cljacobs1975@gmail.com',
  ];
  async function fixAcl(item: FirebaseFirestore.QueryDocumentSnapshot) {
    if (item.data().acl && item.data().acl[user.email!]) {
      const acl = {
        ...item.data().acl,
        [user.uid]: item.data().acl[user.email!],
      };
      delete acl[user.email!];
      await item.ref.update({ acl });
    }
  }
  await db.doc(`/users/${user.uid}`).set({
    id: user.uid,
    email: user.email,
    name: user.displayName,
    avatar: user.photoURL,
  });
  if (user.email && importedUsers.indexOf(user.email) >= 0) {
    const allCampaigns = await db.collection('/campaigns').get();
    if (!!user.email) {
      await Promise.all(
        allCampaigns.docs.map(async (campaign) => {
          await fixAcl(campaign);
          const allCharacters = await db
            .collection(`/campaigns/${campaign.id}/characters`)
            .get();
          await Promise.all(allCharacters.docs.map(fixAcl));
        })
      );
    }
  }
});
