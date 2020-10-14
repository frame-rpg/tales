import * as admin from 'firebase-admin';

import { Character, PlayerCharacter } from '../../types/character';
import { campaign, characters, inventory } from './fantasyFights';

import { addItem } from './util';
import { users } from './users';

(async () => {
  const flagArgs: Record<string, string> = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i = i + 2) {
    flagArgs[args[i].slice(2)] = args[i + 1];
  }

  if (!flagArgs.gm) {
    throw new TypeError('required argument --gm uid');
  }

  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://framesystem-rpg.firebaseio.com',
    projectId: 'framesystem-rpg',
  });

  const acl = { [flagArgs.gm]: 'gm' };
  if (flagArgs.player) {
    acl[flagArgs.player] = 'player';
  }

  const ffc = await app
    .firestore()
    .doc(`/campaigns/${campaign.campaignId}`)
    .set({ ...campaign, acl });

  await app
    .firestore()
    .doc('/pages/rules')
    .set({
      authors: [flagArgs.gm],
    });

  await Promise.all([
    Promise.all(
      characters
        .map((c) => {
          if (flagArgs.player) {
            return { ...c, acl } as PlayerCharacter;
          } else {
            return c;
          }
        })
        .map((c: PlayerCharacter) => {
          inventory[c.characterId].forEach((item) => addItem(c, item));
          return c;
        })
        .map((p) =>
          app
            .firestore()
            .doc(
              `/campaigns/${campaign.campaignId}/characters/${p.characterId}`
            )
            .set({ ...p, campaignId: campaign.campaignId })
        )
    ),
    Promise.all(
      users.map((user: any) =>
        app.firestore().doc(`/users/${user.userId}`).set(user)
      )
    ),
  ]);
})();
export {};
