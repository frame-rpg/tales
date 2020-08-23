import {
  BaseRoll,
  FinalizedRoll,
  RequestedRoll,
  Roll,
  RolledRoll,
} from 'types/event';
import { Campaign, NewCampaign } from 'types/campaign';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from 'types/character';
import { CharacterBase } from 'types/character_base';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  public current: Observable<Campaign>;
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private userService: UserService
  ) {}

  list() {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Campaign>('campaigns', (ref) =>
            ref.where(`acl.${user.email}`, 'in', ['read', 'write', 'admin'])
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  gm(campaign: Observable<Campaign>) {
    return campaign.pipe(
      map(({ acl }) =>
        Object.entries(acl)
          .filter(([, level]) => level === 'admin')
          .map(([id]) => id)
      ),
      filter((gms) => gms.length > 0),
      map((gms) => gms[0]),
      switchMap((gm) => this.userService.get(gm))
    );
  }

  get(id: string) {
    return this.firestore.doc<Campaign>(`/campaigns/${id}`).valueChanges();
  }

  update(campaign: Partial<Campaign> & { id: string }) {
    return this.firestore.doc(`/campaigns/${campaign.id}`).update(campaign);
  }

  characters({ id, characters }: { id: string; characters: string[] }) {
    return this.firestore
      .collection<Character>(`/characters`, (query) =>
        query
          .where(firestore.FieldPath.documentId(), 'in', characters)
          .where('campaign', '==', id)
      )
      .valueChanges({ idField: 'id' });
  }

  doRoll(roll: Roll) {
    return this.firestore.doc<Roll>(`/rolls/${roll.id}`).set(roll);
  }

  requestRoll(roll: BaseRoll) {
    return this.firestore.collection('/rolls').add(roll);
  }

  listRolls(id: string) {
    return this.firestore
      .collection<Roll>(`/rolls`, (query) => query.where('campaign', '==', id))
      .valueChanges({ idField: 'id' });
  }

  async create(campaign: NewCampaign) {
    const user = await this.auth.currentUser;
    const toAdd = { ...campaign };
    toAdd.acl[user.email] = 'admin';
    return this.firestore.collection('/campaigns').add(toAdd);
  }
}
