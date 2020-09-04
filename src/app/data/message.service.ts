import {
  Message,
  MessageAddress,
  MessageState,
  SentMessage,
} from '../../../types/message';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async send(message: Message) {
    await this.firestore
      .collection(`/${message.to.type}s/${message.to.id}/messages`)
      .add(message);
  }

  async mark(message: SentMessage, state: MessageState) {
    await this.firestore
      .doc(`/${message.to.type}s/${message.to.id}/messages/${message.id}`)
      .update({ state });
  }

  list(address: MessageAddress) {
    return this.firestore
      .collection<Message>(`/${address.type}s/${address.id}/messages`)
      .valueChanges({ idField: 'id' });
  }

  fetchAll(addresses: MessageAddress[]) {
    return combineLatest(
      addresses.map((address) =>
        this.list(address).pipe(map((list) => ({ address, list })))
      )
    ).pipe(
      map((vals) =>
        vals.reduce(
          (acc, curr) => {
            if (curr.address.type === 'campaign') {
              return { characters: acc.characters, campaign: curr.list };
            } else {
              return {
                campaign: acc.campaign,
                characters: { ...acc.characters, [curr.address.id]: curr.list },
              };
            }
          },
          { characters: {}, campaign: [] }
        )
      ),
      publishReplay(1),
      refCount()
    );
  }
}
