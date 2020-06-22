import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Character, NewCharacter } from '../types/character';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async list() {
    const user = await this.auth.currentUser;
    return this.firestore
      .collection<Character>('characters', (ref) =>
        ref.where(`acl.${user.uid}`, 'array-contains-any', [
          'read',
          'write',
          'admin',
        ])
      )
      .valueChanges({ idField: 'id' });
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
