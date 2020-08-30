import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Message } from 'types/message';
import { MessageService } from 'src/app/data/message.service';
import { Roll } from 'types/event';
import { RollService } from 'src/app/actions/roll/roll.service';

@Component({
  selector: 'player',
  templateUrl: './playerview.component.html',
  styleUrls: ['./playerview.component.scss'],
})
export class PlayerviewComponent implements OnInit, OnDestroy {
  campaign: Observable<Campaign>;
  myCharacters: Observable<Character[]>;
  messages: Observable<{
    campaign: Message[];
    characters: Record<string, Message[]>;
  }>;
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
    this.haveRolls = this.messages.pipe(
      map((mailbox) =>
        Object.entries(mailbox.characters).reduce(
          (acc, [characterId, messageList]) => ({
            ...acc,
            [characterId]: messageList.some(
              (message) =>
                message.state === 'new' && message.messageType === 'rollRequest'
            ),
          }),
          {}
        )
      ),
      startWith({})
    );
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }
}
