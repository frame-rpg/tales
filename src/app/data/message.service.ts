import { Observable, combineLatest } from 'rxjs';
import { map, publishReplay, refCount, take } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Campaign } from 'types/campaign';
import { Character } from 'types/character';
import { Id } from 'types/idtypes';
import { Injectable } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  async scene(campaign: Campaign, characters: Character[]) {
    const mailboxes = [
      this.addressString(campaign),
      ...characters.map((c) => this.addressString(c)),
    ];
    await Promise.all(
      mailboxes.map((mailbox) =>
        this.firestore
          .collection<Message>(mailbox, (query) =>
            query.where('state', 'in', ['viewed', 'new'])
          )
          .get()
          .pipe(take(1))
          .toPromise()
          .then((msgs) =>
            msgs.docs
              .filter((doc) => doc.data().messageType !== 'say')
              .map((msg) => `${mailbox}/${msg.id}`)
          )
          .then((ids) =>
            Promise.all(
              ids.map((id) =>
                this.firestore.doc(id).update({ state: 'archived' })
              )
            )
          )
      )
    );
  }

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
      .valueChanges({ idField: 'messageId' })
      .pipe(
        map((messages: Message[]) =>
          messages.filter((message) => message.state !== 'archived')
        )
      );
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
