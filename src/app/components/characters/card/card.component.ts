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
  filter,
  map,
  publishReplay,
  refCount,
  scan,
  takeUntil,
} from 'rxjs/operators';

import { AclType } from 'types/acl';
import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'types/campaign';
import { CharacterSkill } from 'types/skill';
import { NoncombatService } from 'src/app/actions/noncombat/noncombat.service';
import { arrayToRecordArray } from '../../../data/util';

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnChanges, OnInit, OnDestroy {
  @Input('character') private _character: Character;
  character: Observable<Character>;
  characterSubject: BehaviorSubject<Character>;
  skillCategories: Observable<string[]>;
  skillsByCategory: Observable<Record<string, CharacterSkill[]>>;
  locked: Observable<boolean>;
  relationship: Observable<AclType>;
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject.asObservable();
  actionSubject = new Subject<{
    event: MouseEvent;
    action: 'lock' | 'skill';
    skill?: string;
  }>();
  action = this.actionSubject.asObservable().pipe(
    takeUntil(this.destroying),
    distinctUntilChanged((a, b) => a === b)
  );

  characterAttributeNames = {
    player: ['might', 'speed', 'conviction', 'focus', 'health'],
    companion: ['loyalty', 'health'],
  };

  constructor(
    private noncombatService: NoncombatService,
    private auth: AngularFireAuth
  ) {}

  ngOnDestroy() {
    this.destroyingSubject.next(true);
  }

  ngOnInit() {
    this.characterSubject = new BehaviorSubject(this._character);
    this.character = this.characterSubject
      .asObservable()
      .pipe(publishReplay(1), refCount());
    this.skillsByCategory = this.character.pipe(
      filter((ch) => ch.subtype !== 'nonplayer'),
      map((character: SkilledCharacter) =>
        arrayToRecordArray(
          character.skills.sort((a, b) => a.name.localeCompare(b.name)),
          'category'
        )
      )
    );
    this.skillCategories = this.skillsByCategory.pipe(
      map((cats) =>
        Object.keys(this.skillsByCategory)
          .filter((cat) => cat === 'noncombat')
          .sort((a, b) => a.localeCompare(b))
      )
    );
    this.relationship = combineLatest([this.auth.user, this.character]).pipe(
      map(([{ uid }, { acl }]) => acl[uid]),
      filter((v) => !!v)
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
    this.locked = this.action.pipe(
      filter(({ action }) => action === 'lock'),
      scan<any, boolean>((acc) => !acc, true)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.character?.currentValue) {
      this.characterSubject.next(changes.character.currentValue);
    }
  }

  check(event: MouseEvent, skill: CharacterSkill) {
    this.actionSubject.next({ event, action: 'skill', skill: skill.skillId });
  }

  toggleLock(event: MouseEvent) {
    this.actionSubject.next({ event, action: 'lock' });
  }
}
