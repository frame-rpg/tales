import { filter, map, switchMap } from 'rxjs/operators';

import { AclType } from 'types/acl';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Campaign } from 'types/campaign';
import { CampaignId } from 'types/idtypes';
import { Character } from 'types/character';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { addId } from './rxutil';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private userService: UserService
  ) {}

  list(acls: AclType[] = ['read', 'write', 'admin']) {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Campaign>('campaigns', (ref) =>
            ref.where(`acl.${user.email}`, 'in', acls)
          )
          .valueChanges({ idField: 'campaignId' })
      )
    );
  }

  get(id: CampaignId) {
    return this.firestore
      .doc<Campaign>(`/campaigns/${id.campaignId}`)
      .snapshotChanges()
      .pipe(addId('campaignId'));
  }

  update(id: CampaignId, patch: Partial<Campaign>) {
    return this.firestore.doc(`/campaigns/${id.campaignId}`).update(patch);
  }

  usersCharacters(campaignId: string): Observable<Character[]> {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>('/characters', (query) =>
            query
              .where('campaign', '==', campaignId)
              .where(new firestore.FieldPath('acl', user.email), '==', 'admin')
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }
}
