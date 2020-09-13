import { CampaignId, CharacterId, UserId } from 'types/idtypes';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from 'types/character';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addId } from './rxutil';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  private containerAddress(id: UserId | CampaignId): string {
    if (id.type === 'user') {
      return `/users/${id.userId}/characters`;
    } else {
      return `/campaigns/${id.campaignId}/characters`;
    }
  }

  private characterAddress(id: CharacterId): string {
    if (id.parent === 'campaign') {
      return `/campaigns/${id.campaignId}/characters/${id.characterId}`;
    } else {
      return `/users/${id.userId}/characters/${id.characterId}`;
    }
  }

  list(id: UserId | CampaignId) {
    return this.firestore
      .collection<Character>(this.containerAddress(id))
      .valueChanges({ idField: 'characterId' });
  }

  get(id: CharacterId): Observable<Character> {
    return this.firestore
      .doc<Character>(this.characterAddress(id))
      .snapshotChanges()
      .pipe(addId('characterId'), publishReplay(1), refCount());
  }

  update(id: CharacterId, character: Partial<Character>) {
    return this.firestore.doc(this.characterAddress(id)).update(character);
  }
}
