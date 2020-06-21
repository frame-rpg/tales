import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Participant } from '../types/participant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  constructor(private firestore: AngularFirestore) {}

  get(id: String): Observable<Participant> {
    return this.firestore
      .doc<Participant>(`/participants/${id}`)
      .snapshotChanges()
      .pipe(
        map((v) => ({ id: v.payload.id, ...v.payload.data() } as Participant))
      );
  }

  update(id: String, participant: Participant) {
    return this.firestore.doc(`participants/${id}`).update(participant);
  }
}
