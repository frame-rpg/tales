import { Campaign, NewCampaign } from '../types/campaign';
import { NewScene, Scene } from '../types/scene';
import { map, switchMap, tap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
          .pipe(tap((v) => console.log(v)))
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

  addScene(scene: NewScene) {
    return this.firestore
      .collection(`/campaigns/${scene.campaignId}/scenes`)
      .add(scene);
  }

  listScenes(id: string) {
    return this.firestore
      .collection<Scene>(`/campaigns/${id}/scenes`)
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
