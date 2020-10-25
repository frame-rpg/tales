import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CampaignId, CharacterId } from 'types/idtypes';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { Note } from 'types/note';
import { addId } from 'src/app/data/rxutil';

@Component({
  selector: 'framesystem-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit, OnChanges {
  @Input('parent') private _parent: CharacterId | CampaignId;
  parentSubject: BehaviorSubject<CharacterId | CampaignId>;
  parent: Observable<CharacterId | CampaignId>;
  activeSubject = new BehaviorSubject<Note>(null);
  active: Observable<Note>;
  list: Observable<Note[]>;

  constructor(private firebase: AngularFirestore) {}

  ngOnInit(): void {
    this.parentSubject = new BehaviorSubject(this._parent);
    this.parent = this.parentSubject.asObservable();
    this.list = this.parent.pipe(
      distinctUntilChanged(
        (a, b) =>
          a.type === b.type &&
          (a.type === 'campaign' ||
            a.characterId === (b as CharacterId).characterId) &&
          a.campaignId === b.campaignId
      ),
      switchMap((c) => {
        if (c.type === 'campaign') {
          return this.firebase
            .collection<Note>(`/campaigns/${c.campaignId}/notes`)
            .valueChanges({ idField: 'noteId' });
        } else {
          return this.firebase
            .collection<Note>(
              `/campaigns/${c.campaignId}/characters/${c.characterId}/notes`
            )
            .valueChanges({ idField: 'noteId' });
        }
      }),
      publishReplay(1),
      refCount()
    );
    this.active = this.activeSubject.asObservable().pipe(
      filter((v) => !!v),
      distinctUntilKeyChanged('noteId'),
      switchMap((n) => {
        if (n.parentId.type === 'campaign') {
          return this.firebase
            .doc<Note>(`/campaigns/${n.parentId.campaignId}/notes`)
            .snapshotChanges();
        } else {
          return this.firebase
            .doc<Note>(
              `/campaigns/${n.parentId.campaignId}/characters/${n.parentId.characterId}/notes`
            )
            .snapshotChanges();
        }
      }),
      addId('noteId'),
      publishReplay(1),
      refCount()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes._parent?.currentValue) {
      this.parentSubject.next(changes.character.currentValue);
    }
  }

  view(note: Note) {
    this.activeSubject.next(note);
  }
}
