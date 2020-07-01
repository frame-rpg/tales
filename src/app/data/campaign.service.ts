import { Campaign, NewCampaign } from 'src/types/campaign';
import { filter, map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CharacterBase } from 'src/types/character_base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
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
      .collection<T>(`/campaigns/${id}/characters`)
      .valueChanges({ idField: 'id' })
      .pipe(
        map((characters) => characters.filter((v) => v.type === inType.type))
      );
  }

  async create(campaign: NewCampaign) {
    const user = await this.auth.currentUser;
    const toAdd = { ...campaign };
    toAdd.acl[user.uid] = 'admin';
    console.log(toAdd);
    return this.firestore.collection('/campaigns').add(toAdd);
  }
}
