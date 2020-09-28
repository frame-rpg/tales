import { ActivatedRoute, ParamMap } from '@angular/router';
import { Character, SkilledCharacter } from 'types/character';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message, RollRequest } from 'types/message';
import { Observable, Subject, combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AttackService } from 'src/app/actions/attack/attack.service';
import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { InitiativeService } from 'src/app/actions/initiative/initiative.service';
import { MessageService } from 'src/app/data/message.service';
import { mapById } from 'src/app/data/rxutil';

type ActionType = 'initiative' | 'noncombat' | 'reset' | 'rest';
interface Action {
  type: ActionType;
  character?: Character;
  event: MouseEvent;
}

@Component({
  selector: 'framesystem-campaign-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  campaign: Observable<Campaign>;
  characters: Observable<Character[]>;
  mappedCharacters: Observable<Record<string, Character>>;
  messages: Observable<Message[]>;
  campaignMessages: Observable<Message[]>;
  requiredRolls: Observable<RollRequest[]>;
  gm: Observable<boolean>;
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject
    .asObservable()
    .pipe(filter((v) => v === true));

  actionSubject = new Subject<Action>();
  action = this.actionSubject
    .asObservable()
    .pipe(distinctUntilChanged(), publishReplay(1), refCount());

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private attackService: AttackService,
    private initiativeService: InitiativeService,
    private route: ActivatedRoute,
    private auth: AngularFireAuth
  ) {}

  ngOnDestroy(): void {
    this.destroyingSubject.next(true);
  }

  ngOnInit(): void {
    this.campaign = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.get({
          campaignId: params.get('campaignId'),
          type: 'campaign',
        })
      ),
      publishReplay(1),
      refCount()
    );
    this.characters = this.campaign.pipe(
      switchMap((campagin) =>
        this.characterService.list(campagin, ['viewer', 'player', 'gm'])
      ),
      publishReplay(1),
      refCount()
    );
    this.gm = combineLatest([this.campaign, this.auth.user]).pipe(
      map(([{ acl }, { uid }]) => acl[uid] === 'gm')
    );
    this.mappedCharacters = this.characters.pipe(mapById('characterId'));
    this.messages = combineLatest([this.characters, this.campaign]).pipe(
      switchMap(([characters, campaign]) =>
        this.messageService.fetchAll([
          campaign,
          ...(characters as CharacterId[]),
        ])
      ),
      publishReplay(1),
      refCount()
    );
    this.requiredRolls = combineLatest([this.characters, this.messages]).pipe(
      map(([characters, messages]) =>
        messages.filter(
          (m) =>
            m.messageType === 'rollRequest' &&
            m.state === 'new' &&
            m.to.type === 'character' &&
            characters.map((c) => c.characterId).includes(m.to.characterId)
        )
      )
    ) as Observable<RollRequest[]>;
    this.campaignMessages = this.messages.pipe(
      map((messages) => messages.filter((m) => m.to.type === 'campaign'))
    );

    const actionStream = combineLatest([
      this.campaign,
      this.characters,
      this.action,
    ]).pipe(takeUntil(this.destroying));

    actionStream
      .pipe(filter(([, , event]) => event.type === 'initiative'))
      .subscribe(([campaign, characters]) =>
        this.initiativeService.trigger(characters, campaign)
      );
    actionStream
      .pipe(filter(([, , event]) => event.type === 'rest'))
      .subscribe(([campaign, characters]) => {
        this.characterService.rest(characters);
        this.messageService.scene(campaign, characters);
      });
    actionStream
      .pipe(filter(([, , event]) => event.type === 'reset'))
      .subscribe(([, characters]) => this.characterService.reset(characters));
  }

  initiative(event: MouseEvent) {
    this.actionSubject.next({ event, type: 'initiative' });
  }

  noncombat(event: MouseEvent, character: Character) {
    this.actionSubject.next({ event, character, type: 'noncombat' });
  }

  rest(event: MouseEvent) {
    this.actionSubject.next({ event, type: 'rest' });
  }

  reset(event: MouseEvent) {
    this.actionSubject.next({ event, type: 'reset' });
  }
}
