import * as firebase from 'firebase/app';

import {
  Observable,
  Subject,
  Subscriber,
  VirtualTimeScheduler,
  combineLatest,
  of,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';

interface Status {
  state: 'offline' | 'online';
}

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hiddenStream = new Subject<boolean>();

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) {
    this.init();
    document.addEventListener('visibilitychange', () =>
      this.hiddenStream.next(document.visibilityState === 'hidden')
    );
  }

  getPresence(uid: string) {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  async setPresence(status: string, uid: string) {
    return await this.db
      .object(`status/${uid}`)
      .update({ status, timestamp: firebase.database.ServerValue.TIMESTAMP });
  }

  private init() {
    const onlineState = this.auth.authState.pipe().pipe(
      switchMap((user) => {
        if (user) {
          return this.db
            .object('.info/connected')
            .valueChanges()
            .pipe(map((connected) => (connected ? 'online' : 'offline')));
        } else {
          return of('offline');
        }
      })
    );

    this.auth.authState.subscribe((user) => {
      if (user) {
        this.db.object(`status/${user.uid}`).query.ref.onDisconnect().update({
          status: 'offline',
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
      }
    });

    combineLatest([
      onlineState,
      this.auth.user,
      this.hiddenStream.asObservable().pipe(startWith(true)),
    ])
      .pipe(tap((v) => console.log(v)))
      .subscribe(([online, { uid }, visible]) => {
        this.setPresence(visible ? online : 'hidden', uid);
      });
  }

  getPresences() {
    return this.db
      .object<Status>('status')
      .valueChanges()
      .pipe(
        map((v) =>
          Object.entries(v)
            .filter(([, { status }]) => status === 'online')
            .map(([uid]) => uid)
        ),
        distinctUntilChanged(
          (a, b) =>
            a.length === b.length &&
            a.filter((v) => b.includes(v)).length === a.length
        )
      );
  }
}
