import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(private firestore: AngularFirestore) {}

  skillInfo() {
    return this.firestore.doc(`/rules/skill`).snapshotChanges();
  }

  templates() {
    return this.firestore.doc('/rules/characterTemplates').snapshotChanges();
  }
}
