import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { Character, Companion, PlayerCharacter } from 'src/types/character';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SkillDetails, SkillLevels } from 'src/types/skill';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'src/types/campaign';
import { CharacterAttribute } from 'src/types/attribute';
import { RulesService } from 'src/app/data/rules.service';
import { User } from 'src/types/user';
import { UserService } from 'src/app/data/user.service';

interface DisplayAttribute extends CharacterAttribute {
  wound: boolean;
  current: number;
  name: string;
}

interface DisplaySkill {
  name: string;
  levelName: string;
  level: number;
  description: string;
}

const characterAttributeNames = {
  player: ['might', 'speed', 'conviction', 'focus', 'health'],
  companion: ['loyalty', 'health'],
};

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnChanges, OnInit {
  @Input() character: Character;
  @Input() campaign: Observable<Campaign>;

  viewerIsGM: Observable<boolean>;
  viewerIsActivePlayer: Observable<boolean>;
  activePlayers: Observable<User[]>;
  skillLevels: SkillLevels;
  skillDetails: SkillDetails;
  attributes: Observable<DisplayAttribute[]>;
  skills: Observable<DisplaySkill[]>;

  private characterSubject = new BehaviorSubject<Character>(null);
  character$ = this.characterSubject.asObservable().pipe(
    filter((v) => !!v),
    distinctUntilChanged()
  );

  constructor(
    public auth: AngularFireAuth,
    private userService: UserService,
    private rules: RulesService
  ) {}

  async ngOnInit() {
    this.viewerIsActivePlayer = combineLatest([
      this.character$,
      this.auth.user,
    ]).pipe(map(([{ acl }, { uid }]) => acl[uid] === 'admin'));

    this.viewerIsGM = combineLatest([this.campaign, this.auth.user]).pipe(
      map(([{ acl }, { uid }]) => acl[uid] === 'admin')
    );

    this.activePlayers = this.character$.pipe(
      map(({ acl }) =>
        Object.entries(acl)
          .filter(([, value]) => value === 'admin')
          .map(([key]) => key)
      ),
      switchMap((users) => this.userService.getAll(users))
    );

    this.skillLevels = await this.rules.skillLevels().pipe(take(1)).toPromise();
    this.skillDetails = await this.rules.skillInfo().pipe(take(1)).toPromise();

    this.attributes = this.character$.pipe(
      filter(
        (character) =>
          character.type === 'player' || character.type === 'companion'
      ),
      map((character: PlayerCharacter | Companion) =>
        characterAttributeNames[character.type].map((attr) => ({
          ...character.attributes[attr],
          name: attr,
          ...(character.status?.pools?.[attr] || {
            wound: false,
            current: character.attributes[attr].pool,
          }),
        }))
      )
    );

    this.skills = combineLatest([
      this.character$,
      this.rules.skillLevels(),
      this.rules.skillInfo(),
      this.campaign,
    ]).pipe(
      filter(
        ([character]) =>
          character.type === 'player' || character.type === 'companion'
      ),
      map(
        ([character, skillLevels, skillDetails, campaign]: [
          PlayerCharacter | Companion,
          SkillLevels,
          SkillDetails,
          Campaign
        ]) =>
          campaign.skills
            .filter((skill) => !!character.skills[skill])
            .map((skill) => ({
              name: skillDetails[skill].name,
              level: character.skills[skill],
              levelName: skillLevels[character.skills[skill]],
              description: skillDetails[skill].description,
            }))
      )
    );
  }

  async ngOnChanges(update) {
    this.characterSubject.next(update.character.currentValue);
  }
}
