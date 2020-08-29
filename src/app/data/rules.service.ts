import {
  NewCompanion,
  NewNonplayerCharacter,
  NewPlayerCharacter,
} from 'types/character';

import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  constructor(private firestore: AngularFirestore) {}

  templates() {
    return this.firestore
      .doc<{
        player: NewPlayerCharacter;
        nonplayer: NewNonplayerCharacter;
        companion: NewCompanion;
      }>(`/rules/characterTemplates`)
      .valueChanges();
  }
}
