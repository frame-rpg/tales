import { Injectable } from '@angular/core';
import { Campaign, NewCampaign } from '../types/campaign';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { NewScene, Scene } from '../types/scene';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async list() {
    const user = await this.auth.currentUser;
    return this.firestore
      .collection<Campaign>('campaigns', (ref) =>
        ref.where(`acl.${user.uid}`, 'array-contains-any', [
          'read',
          'write',
          'admin',
        ])
      )
      .valueChanges({ idField: 'id' });
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
    return this.firestore.collection('/campaigns').add(toAdd);
  }
}
