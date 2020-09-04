import { Character, NewCharacter, SkilledCharacter } from 'types/character';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { RulesService } from './rules.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private rulesService: RulesService
  ) {}

  list() {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>('characters', (ref) =>
            ref.where(`acl.${user.email}`, 'in', ['read', 'write', 'admin'])
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  get(id: string) {
    return this.firestore
      .doc<Character>(`/characters/${id}`)
      .valueChanges()
      .pipe(publishReplay(1), refCount());
  }

  update(id: string, character: Partial<Character>) {
    return this.firestore.doc(`/characters/${id}`).update(character);
  }

  async create(character: NewCharacter, options: { inCampaign?: string } = {}) {
    const user = await this.auth.currentUser;
    const toAdd = { ...character };
    toAdd.acl[user.email] = 'admin';
    if (options?.inCampaign) {
      return this.firestore
        .collection(`/campaigns/${options.inCampaign}/characters`)
        .add(toAdd);
    } else {
      return this.firestore.collection('/characters').add(toAdd);
    }
  }
}
