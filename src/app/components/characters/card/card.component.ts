import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { Character, Companion, PlayerCharacter } from 'src/types/character';
import { CharacterAttribute, DisplayAttribute } from 'src/types/attribute';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { CharacterService } from 'src/app/data/character.service';
import { DisplaySkill } from 'src/types/skill';
import { RulesService } from 'src/app/data/rules.service';
import { User } from 'src/types/user';
import { UserService } from 'src/app/data/user.service';

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
  @Input() skillFilter: Observable<string[]>;

  viewerIsGM: Observable<boolean>;
  viewerIsActivePlayer: Observable<boolean>;
  activePlayers: Observable<User[]>;
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
    private characterService: CharacterService,
    private rules: RulesService
  ) {}

  async ngOnInit() {
    this.viewerIsActivePlayer = combineLatest([
      this.character$,
      this.auth.user,
    ]).pipe(map(([{ acl }, { email }]) => acl[email] === 'admin'));

    this.viewerIsGM = combineLatest([this.campaign, this.auth.user]).pipe(
      map(([{ acl }, { email }]) => acl[email] === 'admin')
    );

    this.activePlayers = this.character$.pipe(
      map(({ acl }) =>
        Object.entries(acl)
          .filter(([, value]) => value === 'admin')
          .map(([key]) => key)
      ),
      switchMap((users) => this.userService.getAll(users))
    );

    this.attributes = this.characterService.mapDisplayAttributes(
      this.character$
    );

    this.skills = this.characterService.mapDisplaySkills(
      this.character$,
      this.campaign.pipe(map((campaign) => campaign.skills))
    );
  }

  async ngOnChanges(update: SimpleChanges) {
    this.characterSubject.next(update.character.currentValue);
  }
}
