import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
const db = admin.firestore();

export const onSignup = functions.auth.user().onCreate((user) => {
  return db.doc(`/users/${user.uid}`).set({
    id: user.uid,
    email: user.email,
    name: user.displayName,
    avatar: user.photoURL,
  });
});
