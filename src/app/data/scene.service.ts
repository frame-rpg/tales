import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Scene } from '../types/scene';
import { map } from 'rxjs/operators';
import { Participant } from '../types/participant';

@Injectable({
  providedIn: 'root',
})
export class SceneService {
  constructor(private firestore: AngularFirestore) {}

  get(id: String) {
    return this.firestore
      .doc<Scene>(`/scenes/${id}`)
      .snapshotChanges()
      .pipe(map((v) => ({ id: v.payload.id, ...v.payload.data() } as Scene)));
  }

  update(id: String, scene: Scene) {
    return this.firestore.doc(`scenes/${id}`).update(scene);
  }

  listParticipants(id: string) {
    return this.firestore
      .collection<Participant>(`/scenes/${id}/participants`)
      .valueChanges({ idField: 'id' });
  }
}
