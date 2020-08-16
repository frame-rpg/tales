import {
  NewCompanion,
  NewNonplayerCharacter,
  NewPlayerCharacter,
} from 'types/character';
import { SkillDetails, SkillLevels } from 'types/skill';

import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(private firestore: AngularFirestore) {}

  skillInfo() {
    return this.firestore.doc<SkillDetails>(`/rules/skills`).valueChanges();
  }

  templates() {
    return this.firestore
      .doc<{
        player: NewPlayerCharacter;
        nonplayer: NewNonplayerCharacter;
        companion: NewCompanion;
      }>(`/rules/characterTemplates`)
      .valueChanges();
  }

  skillLevels() {
    return this.firestore.doc<SkillLevels>(`/rules/skillLevels`).valueChanges();
  }
}
