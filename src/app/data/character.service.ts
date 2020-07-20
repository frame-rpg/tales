import { Character, NewCharacter, SkilledCharacter } from 'src/types/character';
import { filter, map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { DisplayAttribute } from 'src/types/attribute';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const characterAttributeNames = {
  player: ['might', 'speed', 'conviction', 'focus', 'health'],
  companion: ['loyalty', 'health'],
};

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  list() {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>('characters', (ref) =>
            ref.where(`acl.${user.uid}`, 'in', ['read', 'write', 'admin'])
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  get(campaignId: string, id: string) {
    return this.firestore
      .doc<Character>(`/campaigns/${campaignId}/characters/${id}`)
      .snapshotChanges()
      .pipe(
        map((v) => ({ id: v.payload.id, ...v.payload.data() } as Character))
      );
  }

  update(character: Partial<Character> & { id: string }) {
    return this.firestore.doc(`/characters/${character.id}`).update(character);
  }

  async create(character: NewCharacter, options: { inCampaign?: string } = {}) {
    const user = await this.auth.currentUser;
    const toAdd = { ...character };
    toAdd.acl[user.uid] = 'admin';
    if (options?.inCampaign) {
      return this.firestore
        .collection(`/campaigns/${options.inCampaign}/characters`)
        .add(toAdd);
    } else {
      return this.firestore.collection('/characters').add(toAdd);
    }
  }

  mapDisplayAttributes(
    character: Observable<Character>
  ): Observable<DisplayAttribute[]> {
    return character.pipe(
      filter(
        (character) =>
          character.type === 'player' || character.type === 'companion'
      ),
      map((character: SkilledCharacter) =>
        characterAttributeNames[character.type].map((attr) => ({
          ...character.attributes[attr],
          name: attr,
          ...(character.status?.pools?.[attr] || {
            wound: false,
            current: character.attributes[attr].pool,
          }),
        }))
      )
    );
  }
}

export function levels(level: number) {
  if (level === -2) {
    return 'Inept';
  } else if (level === -1) {
    return 'Unskilled';
  } else if (level === 0) {
    return 'Proficient';
  } else if (level === 1) {
    return 'Trained';
  } else if (level === 2) {
    return 'Expert';
  }
}
