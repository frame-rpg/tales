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
import { MessageService } from 'src/app/data/message.service';
import { Roll } from 'types/event';
import { RollService } from 'src/app/actions/roll/roll.service';
import { coerceToDate } from 'src/app/data/dates';

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
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.destroyingSubject.next(true);
  }

  ngOnInit(): void {
    this.campaign = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.campaignService.get(params.get('id'))
      ),
      publishReplay(1),
      refCount()
    );
    this.myCharacters = this.campaign.pipe(
      switchMap((campagin) =>
        this.campaignService.usersCharacters(campagin.id)
      ),
      publishReplay(1),
      refCount()
    );
    this.mappedCharacters = this.myCharacters.pipe(
      map((ary) => ary.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}))
    );
    this.messages = combineLatest([this.myCharacters, this.campaign]).pipe(
      switchMap(([characters, campaign]) =>
        this.messageService.fetchAll([
          { type: 'campaign', id: campaign.id },
          ...characters.map((c) => ({
            type: 'character' as 'character',
            id: c.id,
          })),
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
            characters.map((c) => c.id).includes(m.to.id)
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
          (acc, curr) => ({ ...acc, [curr.to.id]: true }),
          characters.reduce((acc, curr) => ({ ...acc, [curr.id]: false }), {})
        )
      ),
      startWith({})
    );
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}
