import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { Ability } from 'types/ability';
import { AclType } from 'types/acl';
import { AngularFireAuth } from '@angular/fire/auth';
import { Attribute } from 'types/attribute';
import { Character } from 'types/character';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from 'src/app/components/characters/character.service';
import { CharacterSkill } from 'types/skill';
import { Item } from 'types/item';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RollService } from 'src/app/rolls/roll.service';
import { SkilledCharacter } from 'types/character';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'framesystem-character-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnChanges, OnInit, OnDestroy {
  @Input('character') private _character: CharacterId;
  character: Observable<Character>;
  skills: Observable<CharacterSkill[]>;
  characterIdSubject: BehaviorSubject<CharacterId>;
  locked: boolean = true;
  gmOrPlayer: Observable<boolean>;
  player: Observable<boolean>;
  gm: Observable<boolean>;
  relationship: Observable<AclType>;
  destroyingSubject = new Subject<boolean>();
  skilled: Observable<boolean>;
  equipment: Observable<Item[]>;
  actions: Observable<Ability[]>;
  destroying = this.destroyingSubject.asObservable();
  attributes: Observable<Attribute[]>;
  attributeValues: Observable<{ name: string; value: number }>;

  attributeUpdateStream = new Subject<{ name: string; value: number }>();
  attributeUpdates: Observable<Record<string, number>>;

  actionSubject = new BehaviorSubject<{
    event: any;
    action: 'lock' | 'skill' | 'defense' | 'action' | 'equip';
    skill?: string;
    equip?: { item: string; equip: boolean };
    ability?: Ability;
  }>(null);

  constructor(
    private rollService: RollService,
    private characterService: CharacterService,
    private auth: AngularFireAuth
  ) {}

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
      switchMap((id) => this.characterService.get(id)),
      publishReplay(1),
      refCount()
    );

    this.skilled = this.character.pipe(
      map((character) => character.subtype !== 'nonplayer')
    );

    this.attributes = this.character.pipe(
      filter((character) => character.subtype !== 'nonplayer'),
      map((character: SkilledCharacter) =>
        this.characterAttributeNames[character.subtype].map(
          (v) => character.attributes[v]
        )
      )
    );

    this.equipment = this.character.pipe(
      map((character) => Object.values(character.equipment)),
      distinctUntilChanged(),
      startWith([]),
      publishReplay(1),
      refCount()
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

    this.gm = this.relationship.pipe(map((a) => a === 'gm'));

    this.actions = this.character.pipe(
      filter((c) => c.subtype !== 'nonplayer'),
      map((character: SkilledCharacter) =>
        this.characterService.actions(character, {})
      )
    );

    this.skills = this.character.pipe(
      filter((character) => character.subtype !== 'nonplayer'),
      map((character: SkilledCharacter) =>
        character.skills
          .filter((skill) => skill.type === 'noncombat')
          .sort((a, b) => a.name.localeCompare(b.name))
      )
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
        this.rollService.triggerAction(
          {
            type: 'action',
            category: 'noncombat',
            name: `${skill} trigger`,
            description: 'Activating a noncombat skill',
            effects: [],
            skills: [skill],
            costs: [
              { type: 'initiative', cost: { type: 'concrete', cost: 10 } },
            ],
          },
          character as SkilledCharacter,
          relationship === 'player'
        );
      });

    combineLatest([
      this.character.pipe(filter((c) => c.subtype !== 'nonplayer')),
      this.relationship.pipe(filter((r) => r === 'player')),
      this.action.pipe(filter((a) => a.action === 'action')),
    ])
      .pipe(
        takeUntil(this.destroying),
        distinctUntilChanged((a, b) => a[2].event === b[2].event)
      )
      .subscribe(([character, , { ability }]) => {
        if (ability.category === 'attack') {
          this.rollService.triggerAction(
            ability,
            character as SkilledCharacter,
            true
          );
        }
      });

    combineLatest([
      this.character.pipe(filter((c) => c.subtype !== 'nonplayer')),
      this.relationship.pipe(filter((r) => ['player', 'gm'].includes(r))),
      this.action.pipe(filter((a) => a.action === 'defense')),
    ])
      .pipe(
        takeUntil(this.destroying),
        distinctUntilChanged((a, b) => a[2].event === b[2].event)
      )
      .subscribe(([character, relationship]) => {
        this.rollService.triggerAction(
          {
            type: 'action',
            category: 'defense',
            name: 'Defend yourself',
            description: 'you have been attacked',
            effects: [],
            costs: [],
          },
          character as SkilledCharacter,
          relationship === 'player'
        );
      });

    combineLatest([
      this.character.pipe(filter((c) => c.subtype !== 'nonplayer')),
      this.relationship.pipe(filter((r) => ['player', 'gm'].includes(r))),
      this.action.pipe(filter((a) => a.action === 'equip')),
    ])
      .pipe(
        takeUntil(this.destroying),
        distinctUntilChanged((a, b) => a[2].event === b[2].event)
      )
      .subscribe(([character, , { equip }]) => {
        this.characterService.equip(character, equip.item, equip.equip);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.character?.currentValue) {
      this.characterIdSubject.next(changes.character.currentValue);
    }
  }

  poolChange(name: string, value: number) {
    this.attributeUpdateStream.next({ name, value });
  }

  check(event: MouseEvent, skill: CharacterSkill) {
    this.actionSubject.next({ event, action: 'skill', skill: skill.skillId });
  }

  toggleLock() {
    this.locked = !this.locked;
  }

  triggerAction(event: MouseEvent, ability: Ability) {
    this.actionSubject.next({ event, action: 'action', ability });
  }

  triggerDefend(e: MouseEvent) {
    this.actionSubject.next({ event: e, action: 'defense' });
  }

  equipItem(event: MatCheckboxChange, item: Item) {
    this.actionSubject.next({
      event,
      action: 'equip',
      equip: { item: item.owner.itemId, equip: event.checked },
    });
  }
}
