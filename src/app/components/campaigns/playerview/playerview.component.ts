import { ActivatedRoute, ParamMap } from '@angular/router';
import { Character, SkilledCharacter } from 'types/character';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message, RollRequest } from 'types/message';
import { Observable, Subject, combineLatest } from 'rxjs';
import {
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs/operators';

import { AttackService } from 'src/app/actions/attack/attack.service';
import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { MessageService } from 'src/app/data/message.service';
import { NoncombatService } from 'src/app/actions/noncombat/noncombat.service';
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
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject
    .asObservable()
    .pipe(filter((v) => v === true));

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    private messageService: MessageService,
    private attackService: AttackService,
    private noncombatService: NoncombatService,
    private route: ActivatedRoute
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
  }

  async attack(character: Character, campaign: Campaign) {
    const attack = await this.attackService.triggerSelf(character, campaign);
  }

  async noncombat(character: SkilledCharacter, campaign: Campaign) {
    const noncombat = await this.noncombatService.triggerSelf(character);
  }
}
