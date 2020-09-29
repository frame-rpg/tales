import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { Character, SkilledCharacter } from 'types/character';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  publishReplay,
  refCount,
  scan,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { AclType } from 'types/acl';
import { AngularFireAuth } from '@angular/fire/auth';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { CharacterSkill } from 'types/skill';
import { NoncombatService } from 'src/app/actions/noncombat/noncombat.service';

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnChanges, OnInit, OnDestroy {
  @Input('character') private _character: CharacterId;
  character: Observable<Character>;
  characterIdSubject: BehaviorSubject<CharacterId>;
  locked: Observable<boolean>;
  gmOrPlayer: Observable<boolean>;
  player: Observable<boolean>;
  relationship: Observable<AclType>;
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject.asObservable();
  actionSubject = new BehaviorSubject<{
    event: MouseEvent;
    action: 'lock' | 'skill';
    skill?: string;
  }>(null);
  action = this.actionSubject.asObservable().pipe(
    takeUntil(this.destroying),
    filter((v) => !!v),
    distinctUntilChanged((a, b) => a === b)
  );

  characterAttributeNames = {
    player: ['might', 'speed', 'conviction', 'focus', 'health'],
    companion: ['loyalty', 'health'],
  };

  constructor(
    private noncombatService: NoncombatService,
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

    this.locked = this.action.pipe(
      filter(({ action }) => action === 'lock'),
      scan<any, boolean>((acc) => !acc, true),
      startWith(true)
    );

    combineLatest([
      this.character.pipe(filter((c) => c.subtype !== 'nonplayer')),
      this.relationship,
      this.action.pipe(filter((a) => a.action === 'skill')),
    ]).subscribe(([character, relationship, { skill }]) => {
      if (relationship === 'gm') {
        this.noncombatService.trigger(
          character as SkilledCharacter,
          skill,
          false
        );
      } else if (relationship === 'player') {
        this.noncombatService.trigger(
          character as SkilledCharacter,
          skill,
          true
        );
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.character?.currentValue) {
      this.characterIdSubject.next(changes.character.currentValue);
    }
  }

  check(event: MouseEvent, skill: CharacterSkill) {
    this.actionSubject.next({ event, action: 'skill', skill: skill.skillId });
  }

  toggleLock(event: MouseEvent) {
    this.actionSubject.next({ event, action: 'lock' });
  }
}
