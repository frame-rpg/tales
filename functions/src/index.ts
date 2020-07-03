import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

export const onSignup = functions.auth.user().onCreate(async (user) => {
  async function fixAcl({
    item,
    user,
  }: {
    item: FirebaseFirestore.QueryDocumentSnapshot;
    user: admin.auth.UserRecord;
  }) {
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
  const allCampaigns = await db.collection('/campaigns').get();
  if (!!user.email) {
    await Promise.all(
      allCampaigns.docs.map(async (campaign) => {
        fixAcl({ item: campaign, user });
        const allCharacters = await db
          .collection(`/campaigns/${campaign.id}/characters`)
          .get();
        await Promise.all(
          allCharacters.docs.map(async (character) =>
            fixAcl({ item: character, user })
          )
        );
      })
    );
  }
});
