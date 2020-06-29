import { SkillDetails, SkillLevels } from '../types/skill';

import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(private firestore: AngularFirestore) {}

  skillInfo() {
    return this.firestore.doc(`/rules/skills`).valueChanges() as Observable<
      SkillDetails
    >;
  }

  templates() {
    return this.firestore.doc('/rules/characterTemplates').valueChanges();
  }

  skillLevels() {
    return this.firestore
      .doc('/rules/skillLevels')
      .valueChanges() as Observable<SkillLevels>;
  }
}
