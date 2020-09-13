import { Message, MessageState } from '../../../types/message';
import { Observable, combineLatest } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Id } from 'types/idtypes';
import { Injectable } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  private addressString(address: Id): string {
    if (address.type === 'campaign') {
      return `/campaigns/${address.campaignId}/messages`;
    } else if (address.type === 'user') {
      return `/users/${address.userId}/messages`;
    } else if (address.type === 'character') {
      return `/campaigns/${address.campaignId}/characters/${address.characterId}/messages`;
    }
  }

  async send(message: Omit<Message, 'messageId'>) {
    await this.firestore
      .collection(this.addressString(message.to))
      .add(message);
  }

  async mark(message: Message, state: MessageState) {
    await this.firestore
      .doc(`${this.addressString(message.to)}/${message.messageId}`)
      .update({ state });
  }

  list(address: Id) {
    return this.firestore
      .collection<Message>(`${this.addressString(address)}`)
      .valueChanges({ idField: 'messageId' }) as Observable<Message[]>;
  }

  fetchAll(addresses: Id[]) {
    return combineLatest(addresses.map((address) => this.list(address))).pipe(
      map((mailboxes) => mailboxes.flat()),
      map((mailbox) =>
        mailbox.sort(
          (a, b) =>
            (a.at as Timestamp).toMillis() - (b.at as Timestamp).toMillis()
        )
      ),
      publishReplay(1),
      refCount()
    );
  }
}
