import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Scene } from '../types/scene';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SceneService {
  constructor(private firestore: AngularFirestore) {}

  get(id: String): Observable<Scene> {
    return this.firestore
      .doc<Scene>(`/scenes/${id}`)
      .snapshotChanges()
      .pipe(map((v) => ({ id: v.payload.id, ...v.payload.data() } as Scene)));
  }

  update(id: String, scene: Scene) {
    return this.firestore.doc(`scenes/${id}`).update(scene);
  }
}
