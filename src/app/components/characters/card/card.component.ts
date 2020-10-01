import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  merge,
} from 'rxjs';
import { Character, SkilledCharacter } from 'types/character';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  mergeAll,
  mergeMap,
  publishReplay,
  refCount,
  scan,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { AclType } from 'types/acl';
import { AngularFireAuth } from '@angular/fire/auth';
import { Attribute } from 'types/attribute';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { CharacterSkill } from 'types/skill';
import { RollService } from 'src/app/rolls/roll.service';
import { SpinnerComponent } from 'src/app/shared/spinner.component';

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input('character') private _character: CharacterId;
  character: Observable<Character>;
  skills: Observable<CharacterSkill[]>;
  characterIdSubject: BehaviorSubject<CharacterId>;
  locked: Observable<boolean>;
  gmOrPlayer: Observable<boolean>;
  player: Observable<boolean>;
  relationship: Observable<AclType>;
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject.asObservable();
  attributeValues: Observable<{ name: string; value: number }>;
  actionSubject = new BehaviorSubject<{
    event: MouseEvent;
    action: 'lock' | 'skill' | 'defend';
    skill?: string;
  }>(null);

  @ViewChildren('attributeSpinner') attributeSpinners: QueryList<
    SpinnerComponent
  >;

  action = this.actionSubject.asObservable().pipe(
    takeUntil(this.destroying),
    filter((v) => !!v),
    distinctUntilChanged((a, b) => a.event === b.event)
  );

  characterAttributeNames = {
    player: ['might', 'speed', 'conviction', 'focus', 'health'],
    companion: ['loyalty', 'health'],
  };

  constructor(
    private rollService: RollService,
    private characterService: CharacterService,
    private auth: AngularFireAuth
  ) {}

  ngOnDestroy() {
    this.destroyingSubject.next(true);
  }

  ngOnInit() {
    this.characterIdSubject = new BehaviorSubject(this._character);
    this.character = this.characterIdSubject.asObservable().pipe(
      distinctUntilChanged(
        (a, b) =>
          a.characterId === b.characterId && a.campaignId == b.campaignId
      ),
      switchMap((id) => this.characterService.get(id))
    );

    this.relationship = combineLatest([this.auth.user, this.character]).pipe(
      map(([{ uid }, { acl }]) => acl[uid]),
      filter((v) => !!v),
      publishReplay(1),
      refCount()
    );

    this.gmOrPlayer = this.relationship.pipe(
      map((a) => a === 'gm' || a === 'player')
    );

    this.skills = this.character.pipe(
      filter((character) => character.subtype !== 'nonplayer'),
      map((character: SkilledCharacter) =>
        character.skills
          .filter((skill) => skill.type === 'noncombat')
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    );

    this.locked = this.action.pipe(
      filter(({ action }) => action === 'lock'),
      scan<any, boolean>((acc) => !acc, true),
      startWith(true)
    );

    combineLatest([
      this.character.pipe(filter((c) => c.subtype !== 'nonplayer')),
      this.relationship.pipe(filter((r) => ['player', 'gm'].includes(r))),
      this.action.pipe(filter((a) => a.action === 'skill')),
    ])
      .pipe(
        takeUntil(this.destroying),
        distinctUntilChanged((a, b) => a[2].event === b[2].event)
      )
      .subscribe(([character, relationship, { skill }]) => {
        this.rollService.request({
          character: character as SkilledCharacter,
          skills: [skill],
          type: 'noncombat',
          self: relationship === 'player',
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.character?.currentValue) {
      this.characterIdSubject.next(changes.character.currentValue);
    }
  }

  ngAfterViewInit() {
    this.attributeSpinners.changes.subscribe(
      (spinners: QueryList<SpinnerComponent>) => {
        spinners.forEach((spinner) =>
          spinner.current.subscribe((v) => console.log(v))
        );
      }
    );
  }

  check(event: MouseEvent, skill: CharacterSkill) {
    this.actionSubject.next({ event, action: 'skill', skill: skill.skillId });
  }

  toggleLock(event: MouseEvent) {
    this.actionSubject.next({ event, action: 'lock' });
  }
}
