import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message, RollRequest } from 'types/message';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import {
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Character } from 'types/character';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { MessageService } from 'src/app/data/message.service';
import { coerceToDate } from 'src/app/data/util';
import { mapById } from 'src/app/data/rxutil';

@Component({
  selector: 'player',
  templateUrl: './playerview.component.html',
  styleUrls: ['./playerview.component.scss'],
})
export class PlayerviewComponent implements OnInit, OnDestroy {
  campaign: Observable<Campaign>;
  myCharacters: Observable<Character[]>;
  mappedCharacters: Observable<Record<string, Character>>;
  messages: Observable<Message[]>;
  campaignMessages: Observable<Message[]>;
  requiredRolls: Observable<RollRequest[]>;
  haveRolls: Observable<Record<string, boolean>>;
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject
    .asObservable()
    .pipe(filter((v) => v === true));

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.destroyingSubject.next(true);
  }

  ngOnInit(): void {
    this.campaign = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.get({
          campaignId: params.get('id'),
          type: 'campaign',
        })
      ),
      publishReplay(1),
      refCount()
    );
    this.myCharacters = this.campaign.pipe(
      switchMap((campagin) =>
        this.characterService.list(campagin, ['admin', 'write'])
      ),
      publishReplay(1),
      refCount()
    );
    this.mappedCharacters = this.myCharacters.pipe(mapById('characterId'));
    this.messages = combineLatest([this.myCharacters, this.campaign]).pipe(
      switchMap(([characters, campaign]) =>
        this.messageService.fetchAll([
          campaign,
          ...(characters as CharacterId[]),
        ])
      ),
      publishReplay(1),
      refCount()
    );
    this.requiredRolls = combineLatest([this.myCharacters, this.messages]).pipe(
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

    this.haveRolls = combineLatest([
      this.myCharacters,
      this.requiredRolls,
    ]).pipe(
      map(([characters, messages]) =>
        messages.reduce(
          (acc, curr) => ({
            ...acc,
            [(curr.to as CharacterId).characterId]: true,
          }),
          characters.reduce(
            (acc, curr) => ({ ...acc, [curr.characterId]: false }),
            {}
          )
        )
      ),
      startWith({})
    );
  }
}
