import { Character, NewCharacter } from 'src/types/character';
import { map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  list() {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>('characters', (ref) =>
            ref.where(`acl.${user.uid}`, 'in', ['read', 'write', 'admin'])
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  get(id: String) {
    return this.firestore
      .doc<Character>(`/characters/${id}`)
      .snapshotChanges()
      .pipe(
        map((v) => ({ id: v.payload.id, ...v.payload.data() } as Character))
      );
  }

  update(character: Partial<Character> & { id: string }) {
    return this.firestore.doc(`/characters/${character.id}`).update(character);
  }

  async create(character: NewCharacter) {
    const user = await this.auth.currentUser;
    const toAdd = { ...character };
    toAdd.acl[user.uid] = 'admin';
    return this.firestore.collection('/characters').add(character);
  }
}

export function levels(level: number) {
  if (level === -2) {
    return 'Inept';
  } else if (level === -1) {
    return 'Unskilled';
  } else if (level === 0) {
    return 'Proficient';
  } else if (level === 1) {
    return 'Trained';
  } else if (level === 2) {
    return 'Expert';
  }
}
