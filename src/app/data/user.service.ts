import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { User } from '../../types/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  list() {
    return this.firestore
      .collection<User>('users')
      .valueChanges({ idField: 'id' });
  }

  get(id: String) {
    return this.firestore
      .doc<User>(`/users/${id}`)
      .snapshotChanges()
      .pipe(map((v) => ({ id: v.payload.id, ...v.payload.data() } as User)));
  }

  update(id: String, user: User) {
    return this.firestore.doc(`users/${id}`).update(user);
  }
}
