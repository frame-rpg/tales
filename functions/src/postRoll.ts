import * as functions from 'firebase-functions';

import { FinalizedRoll, Roll } from '../../types/event';

import { SkilledCharacter } from '../../types/character';

export async function postRoll(
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
  db: FirebaseFirestore.Firestore
) {
  const before: Roll = change.before.data() as Roll;
  const after: Roll = change.after.data() as Roll;
  if (before.state === 'requested' && after.state === 'rolled') {
    if (after.skill.id === 'initiative') {
      const character: SkilledCharacter = await db
        .doc(`/characters/${before.roller}`)
        .get()
        .then((d) => d.data() as SkilledCharacter);

      character.status.initiative = Math.max(
        after.die - after.attribute.edge - after.effort,
        1
      );
      const currentAttr = character.status.pools?.[after.attribute.name] || {
        wound: false,
        current: after.attribute.pool,
      };
      currentAttr.current = Math.max(0, currentAttr.current - after.effort);
      character.status.pools = {
        ...character.status.pools,
        [after.attribute.name]: currentAttr,
      };
      await db.doc(`/characters/${before.roller}`).set(character);
      const finalRoll: FinalizedRoll = {
        ...after,
        state: 'finalized',
        result: `Initiative result: ${character.status.initiative}`,
      };
      await db.doc(`/rolls/${finalRoll.id}`).set(finalRoll);
    }
  }
}
