import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from './character.model';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private firestore: AngularFirestore) {}

  list() {
    return this.firestore
      .collection<Character>('characters')
      .valueChanges({ idField: 'id' });
  }

  get(id: String): Observable<Character> {
    return this.firestore
      .doc<Character>(`/characters/${id}`)
      .snapshotChanges()
      .pipe(
        tap((v) => console.log(v)),
        map((v) => ({ id: v.payload.id, ...v.payload.data() } as Character)),
        tap((v) => console.log(v))
      );
  }

  update(id: String, character: Character) {
    return this.firestore.doc(`characters/${id}`).update(character);
  }
}
