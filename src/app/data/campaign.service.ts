import { Campaign, NewCampaign } from 'src/types/campaign';
import { filter, map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Character } from 'src/types/character';
import { CharacterBase } from 'src/types/character_base';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roll } from 'src/types/event';
import { UserService } from './user.service';

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
            ref.where(`acl.${user.uid}`, 'in', ['read', 'write', 'admin'])
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
    return this.firestore
      .doc<Campaign>(`/campaigns/${id}`)
      .snapshotChanges()
      .pipe(
        map((v) => ({ id: v.payload.id, ...v.payload.data() } as Campaign))
      );
  }

  update(campaign: Partial<Campaign> & { id: string }) {
    return this.firestore.doc(`/campaigns/${campaign.id}`).update(campaign);
  }

  listCharacters<T extends CharacterBase>(id: string, inType: Partial<T>) {
    return this.firestore
      .collection<T>(`/campaigns/${id}/characters`, (query) =>
        query.where('type', '==', inType.type)
      )
      .valueChanges({ idField: 'id' });
  }

  listAllCharacters(id: string) {
    return this.firestore
      .collection<Character>(`/campaigns/${id}/characters`)
      .valueChanges({ idField: 'id' });
  }

  listMyCharacters(id: string) {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>(`/campaigns/${id}/characters`, (query) =>
            query.where(`acl.${user.uid}`, '==', 'admin')
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  listRolls(id: string) {
    return this.firestore
      .collection<Roll>(`/campaigns/${id}/rolls`)
      .valueChanges({ idField: 'id' });
  }

  async create(campaign: NewCampaign) {
    const user = await this.auth.currentUser;
    const toAdd = { ...campaign };
    toAdd.acl[user.uid] = 'admin';
    console.log(toAdd);
    return this.firestore.collection('/campaigns').add(toAdd);
  }
}
