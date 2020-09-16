import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Character } from 'types/character';
import { CharacterService } from 'src/app/data/character.service';
import { DefendService } from 'src/app/actions/defend/defend.service';
import { InitiativeService } from 'src/app/actions/initiative/initiative.service';
import { Message } from 'types/message';
import { MessageService } from 'src/app/data/message.service';
import { NoncombatService } from 'src/app/actions/noncombat/noncombat.service';

type ActionType =
  | 'initiative'
  | 'defend'
  | 'zoom'
  | 'noncombat'
  | 'reset'
  | 'rest';
interface UiEvent {
  type: ActionType;
  character?: Character;
  event: MouseEvent;
}

@Component({
  selector: 'campaign-gmview',
  templateUrl: './gmview.component.html',
  styleUrls: ['./gmview.component.scss'],
})
export class GmviewComponent implements OnInit, OnDestroy {
  campaign: Observable<Campaign>;
  openCharacter: Observable<Character>;
  allCharacters: Observable<Character[]>;
  messages: Observable<Message[]>;
  actionTrigger = new Subject<UiEvent>();
  action = this.actionTrigger.asObservable();
  destroyingSubject = new Subject<boolean>();
  destroying = this.destroyingSubject
    .asObservable()
    .pipe(filter((v) => v === true));

  constructor(
    private campaignService: CampaignService,
    private initiativeService: InitiativeService,
    private characterService: CharacterService,
    private defendService: DefendService,
    private messageService: MessageService,
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
          type: 'campaign',
          campaignId: params.get('campaignId'),
        })
      ),
      publishReplay(1),
      refCount()
    );
    this.allCharacters = this.campaign.pipe(
      switchMap((campaign) => this.characterService.list(campaign)),
      map((characters) =>
        characters.sort((a, b) => {
          if (a.initiative >= 0 && b.initiative >= 0) {
            return a.initiative - b.initiative;
          } else {
            return a.name.localeCompare(b.name);
          }
        })
      )
    );
    this.messages = this.campaign.pipe(
      switchMap((campaign) => this.messageService.list(campaign)),
      publishReplay(1),
      refCount()
    );

    this.openCharacter = this.action.pipe(
      filter((a) => a.type === 'zoom'),
      distinctUntilChanged(),
      switchMap(({ character }) => this.characterService.get(character)),
      tap((v) => console.log(v))
    );

    combineLatest([this.campaign, this.allCharacters, this.action])
      .pipe(
        distinctUntilChanged((a, b) => a[2] === b[2]),
        takeUntil(this.destroying)
      )
      .subscribe(async ([campaign, characters, event]) => {
        if (event.type === 'initiative') {
          await this.initiativeService.trigger(characters, campaign);
        } else if (event.type === 'defend') {
          await this.defendService.trigger(event.character, campaign);
        } else if (event.type === 'noncombat') {
          await this.noncombatService.trigger(event.character, campaign);
        } else if (event.type === 'rest') {
          await this.characterService.rest(characters);
          await this.messageService.scene(campaign, characters);
        } else if (event.type === 'reset') {
          await this.characterService.reset(characters);
        }
      });
  }

  initiative(event: MouseEvent) {
    this.actionTrigger.next({ event, type: 'initiative' });
  }

  defend(event: MouseEvent, character: Character) {
    this.actionTrigger.next({ event, character, type: 'defend' });
  }

  zoom(event: MouseEvent, character: Character) {
    this.actionTrigger.next({ event, character, type: 'zoom' });
  }

  noncombat(event: MouseEvent, character: Character) {
    this.actionTrigger.next({ event, character, type: 'noncombat' });
  }

  rest(event: MouseEvent) {
    this.actionTrigger.next({ event, type: 'rest' });
  }

  reset(event: MouseEvent) {
    this.actionTrigger.next({ event, type: 'reset' });
  }
}
