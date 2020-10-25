import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { CampaignId, CharacterId } from 'types/idtypes';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  publishReplay,
  refCount,
  scan,
  switchMap,
  takeUntil,
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
  edit = new FormGroup({
    title: new FormControl(),
    body: new FormControl(),
  });
  editActive: Observable<boolean>;

  private _destroying = new BehaviorSubject<boolean>(false);
  destroying = this._destroying.asObservable().pipe(filter((v) => v));
  private _action = new Subject<{ e: any; a: 'toggleEdit' }>();

  constructor(private firebase: AngularFirestore) {}

  ngOnInit(): void {
    this.parentSubject = new BehaviorSubject(this._parent);
    this.parent = this.parentSubject.asObservable();
    this.list = this.parent.pipe(
      filter((v) => !!v),
      distinctUntilChanged(
        (a, b) =>
          a.type === b.type &&
          (a.type === 'campaign' ||
            a.characterId === (b as CharacterId).characterId) &&
          a.campaignId === b.campaignId
      ),
      switchMap((c) =>
        this.firebase
          .collection<Note>(this.baseAddress())
          .valueChanges({ idField: 'noteId' })
      ),
      publishReplay(1),
      refCount()
    );
    this.active = this.activeSubject.asObservable().pipe(
      filter((v) => !!v),
      distinctUntilKeyChanged('noteId'),
      switchMap((n) =>
        this.firebase.doc<Note>(this.address(n)).snapshotChanges()
      ),
      addId('noteId'),
      publishReplay(1),
      refCount()
    );

    this.editActive = combineLatest([
      this.active,
      this._action.asObservable().pipe(
        filter((v) => v.a === 'toggleEdit'),
        distinctUntilKeyChanged('e')
      ),
    ]).pipe(
      scan(
        (acc, [currentNote, actionToggle]) => {
          if (acc.id === currentNote.noteId) {
            return { id: acc.id, val: !acc.val };
          } else {
            return { id: currentNote.noteId, val: false };
          }
        },
        { id: '', val: false }
      ),
      map((v) => v.val),
      publishReplay(1),
      refCount()
    );

    combineLatest([this.active, this.editActive])
      .pipe(
        takeUntil(this.destroying),
        filter(([, active]) => active)
      )
      .subscribe(([note]) => {
        this.edit.get('title').patchValue(note.title);
        this.edit.get('body').patchValue(note.content);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes._parent?.currentValue && !changes._parent?.firstChange) {
      this.parentSubject.next(changes._parent.currentValue);
    }
  }

  async create() {
    await this.firebase.collection<Partial<Note>>(this.baseAddress()).add({
      updatedAt: new Date(),
      title: 'New Note',
      content: '',
      parentId: idify(this._parent),
    });
  }

  private baseAddress() {
    return this._parent.type === 'character'
      ? `/campaigns/${this._parent.campaignId}/characters/${this._parent.characterId}/notes`
      : `/campaigns/${this._parent.campaignId}/notes`;
  }

  private address(note: Note) {
    return `${this.baseAddress()}/${note.noteId}`;
  }

  view(note: Note) {
    this.activeSubject.next(note);
  }
}

function idify(thing: CampaignId | CharacterId): CampaignId | CharacterId {
  if (thing.type === 'campaign') {
    return {
      type: 'campaign',
      campaignId: thing.campaignId,
    };
  } else {
    return {
      type: 'character',
      characterId: thing.characterId,
      campaignId: thing.campaignId,
    };
  }
}
