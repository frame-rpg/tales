import { CampaignId, CharacterId, UserId } from 'types/idtypes';
import { Character, SkilledCharacter } from 'types/character';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { AclType } from 'types/acl';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { addId } from './rxutil';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  async resetOne(character: SkilledCharacter) {
    const patch = Object.entries(character.attributes).reduce(
      (acc, [attrName, attrVal]) => ({
        ...acc,
        [`attributes.${attrName}.current`]: attrVal.pool,
        [`attributes.${attrName}.wound`]: false,
      }),
      {
        initiative: 0,
      }
    );
    await this.update(character, patch);
  }

  async reset(characters: Character[]) {
    await Promise.all(
      characters
        .filter((c) => c.subtype !== 'nonplayer')
        .map((character: SkilledCharacter) => this.resetOne(character))
    );
  }

  async restOne(character: SkilledCharacter) {
    const patch = Object.entries(character.attributes).reduce(
      (acc, [attrName, attrVal]) => ({
        ...acc,
        [`attributes.${attrName}.current`]: Math.min(
          attrVal.pool,
          attrVal.current + Math.ceil(attrVal.pool / 5)
        ),
      }),
      {
        initiative: 0,
      }
    );
    await this.update(character, patch);
  }

  async rest(characters: Character[]) {
    await Promise.all(
      characters
        .filter((c) => c.subtype !== 'nonplayer')
        .map((character: SkilledCharacter) => this.restOne(character))
    );
  }
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
    return `/campaigns/${id.campaignId}/characters/${id.characterId}`;
  }

  list(id: CampaignId): Observable<Character[]>;
  list(id: CampaignId, acl: AclType[]): Observable<Character[]>;
  list(id: CampaignId, acl?: AclType[]): Observable<Character[]> {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>(this.containerAddress(id), (query) =>
            acl && acl.length > 0
              ? query.where(`acl.${user.uid}`, 'in', acl)
              : query
          )
          .valueChanges({ idField: 'characterId' })
      )
    );
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

  setInitiative(id: CharacterId, initiative: number) {
    return this.update(id, { initiative });
  }
}
