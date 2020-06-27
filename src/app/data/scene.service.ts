import { NewParticipant, Participant } from '../types/participant';

import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Scene } from '../types/scene';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SceneService {
  constructor(private firestore: AngularFirestore) {}

  get(campaignId: string, sceneId: string) {
    return this.firestore
      .doc<Scene>(`/campaigns/${campaignId}/scenes/${sceneId}`)
      .snapshotChanges()
      .pipe(map((v) => ({ id: v.payload.id, ...v.payload.data() } as Scene)));
  }

  update(id: String, scene: Scene) {
    return this.firestore.doc(`scenes/${id}`).update(scene);
  }

  listParticipants(campaignId: string, sceneId: string) {
    return this.firestore
      .collection<Participant>(
        `/campaigns/${campaignId}/scenes/${sceneId}/participants`
      )
      .valueChanges({ idField: 'id' });
  }

  addParticipant(
    campaignId: string,
    sceneId: string,
    participant: NewParticipant
  ) {
    return this.firestore
      .collection(`/campaigns/${campaignId}/scenes/${sceneId}/participants`)
      .add(participant);
  }

  updateParticipant(sceneId: string, participant: Participant) {
    return this.firestore
      .doc(`/scenes/${sceneId}/participants/${participant.id}`)
      .set(participant);
  }
}
