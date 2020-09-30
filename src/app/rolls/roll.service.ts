import { CampaignId, CharacterId } from 'types/idtypes';
import { Character, SkilledCharacter } from 'types/character';
import { Initiative, RollMetadata, RollRequest, RollResult } from 'types/roll';
import { InjectedData, ResolveComponent } from './resolve/resolve.component';
import {
  RequestComponent,
  RequestDialogData,
} from './request/request.component';

import { AngularFirestore } from '@angular/fire/firestore';
import { CharacterService } from '../data/character.service';
import { FirebaseApp } from '@angular/fire';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SkillType } from 'types/skill';
import { Weapon } from 'types/equipment';
import { WoundService } from '../actions/wound/wound.service';
import { take } from 'rxjs/operators';

interface BaseRequestData {
  type: SkillType;
  skills?: string[];
}

interface InitiativeRequestData extends BaseRequestData {
  type: 'initiative';
  characters: Character[];
}

interface HealthRequestData extends BaseRequestData {
  type: 'health';
  self: boolean;
  character: SkilledCharacter;
}

interface AttackRequestData extends BaseRequestData {
  type: 'attack';
  self: boolean;
  character: SkilledCharacter;
  weapon?: Weapon;
}

interface DefenseRequestData extends BaseRequestData {
  type: 'attack';
  self: boolean;
  character: SkilledCharacter;
}

interface NoncombatRequestData extends BaseRequestData {
  type: 'noncombat';
  self: boolean;
  character: SkilledCharacter;
}

type RequestData =
  | InitiativeRequestData
  | HealthRequestData
  | AttackRequestData
  | DefenseRequestData
  | NoncombatRequestData;

@Injectable({
  providedIn: 'root',
})
export class RollService {
  constructor(
    private dialogService: MatDialog,
    private firestore: AngularFirestore,
    private characterService: CharacterService,
    private woundService: WoundService,
    private db: FirebaseApp
  ) {}

  async sendRequest(roll: RollRequest) {
    await this.firestore
      .collection(`/campaigns/${roll.character.campaignId}/rolls`)
      .add(roll);
  }

  async scene(campaign: CampaignId) {
    const actives = await this.firestore
      .collection(`/campaigns/${campaign.campaignId}/rolls`, (query) =>
        query.where('archive', '==', false).limit(400)
      )
      .get()
      .pipe(take(1))
      .toPromise();
    await this.db
      .firestore()
      .runTransaction((txn) =>
        Promise.all(
          actives.docs.map((doc) => txn.update(doc.ref, { archive: true }))
        )
      );
    if (actives.docs.length < 400) {
      return;
    } else {
      await this.scene(campaign);
    }
  }

  async request(data: RequestData) {
    const partialRequest = await this.dialogService
      .open<
        RequestComponent<RollRequest>,
        RequestDialogData,
        Partial<RollRequest>
      >(RequestComponent, {
        data,
      })
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    if (!partialRequest) {
      return;
    }
    const meta: Partial<RollMetadata> = {
      at: new Date(),
      archive: false,
      state: 'requested',
    };
    const req = { ...partialRequest, ...meta } as RollRequest;
    if (data.type === 'initiative') {
      await this.fireInitiativeRequests(
        data.characters,
        partialRequest as Initiative
      );
    } else if (data.self) {
      await this.resolve({ ...req, character: data.character }, data.character);
    } else {
      await this.sendRequest({ ...req, character: data.character });
    }
  }

  async resolve(roll: RollRequest, character: SkilledCharacter) {
    const result = await this.dialogService
      .open<ResolveComponent, InjectedData, RollResult>(ResolveComponent, {
        data: { roll, character },
      })
      .afterClosed()
      .pipe(take(1))
      .toPromise();

    const patch: any = {};
    if (roll.type === 'initiative') {
      patch.initiative = result.result;
    } else if ('initiative' in roll) {
      patch.initiative = character.initiative + roll.initiative + result.effort;
    } else {
      patch.initiative = character.initiative + result.effort;
    }
    if (result.effort) {
      patch[`attributes.${result.attribute}.current`] = Math.max(
        0,
        character.attributes[result.attribute].current - result.effort
      );
    }
    if (result.critical) {
      patch[`attributes.${result.attribute}.current`] = Math.max(
        0,
        character.attributes[result.attribute].current - 3
      );
    }
    await this.characterService.update(character, patch);

    if (result.rollId) {
      await this.firestore
        .doc(`/campaigns/${result.character.campaignId}/rolls/${result.rollId}`)
        .update(result);
    } else {
      await this.firestore
        .collection(`/campaigns/${result.character.campaignId}/rolls}`)
        .add(result);
    }

    if (roll.type === 'defense' && !result.success) {
      await this.sendRequest({
        at: new Date(),
        type: 'health',
        assets: 0,
        target: roll.damage + roll.target - result.result,
        edge: 0,
        state: 'requested',
        items: [],
        archive: false,
        character: {
          type: 'character',
          characterId: character.characterId,
          campaignId: character.campaignId,
        },
      });
    } else if (roll.type === 'health' && !result.success) {
      this.woundService.triggerWound(character);
    }
  }

  results(campaign: CampaignId): Observable<RollResult[]> {
    return this.firestore
      .collection<RollResult>(
        `/campaigns/${campaign.campaignId}/rolls`,
        (query) =>
          query
            .where('archive', '==', false)
            .where('state', '==', 'rolled')
            .orderBy('at')
      )
      .valueChanges();
  }

  requests(
    campaign: CampaignId,
    characters: CharacterId[]
  ): Observable<RollRequest[]> {
    return this.firestore
      .collection<RollRequest>(
        `/campaigns/${campaign.campaignId}/rolls`,
        (query) =>
          query
            .where('archive', '==', false)
            .where('state', '==', 'requested')
            .where(
              'character.characterId',
              'in',
              characters.map((character) => character.characterId)
            )
            .orderBy('at')
      )
      .valueChanges({ idField: 'rollId' });
  }

  async fireInitiativeRequests(
    characters: Character[],
    initRequest: Initiative
  ) {
    await Promise.all(
      characters.map(async (character) => {
        if (
          character.subtype === 'nonplayer' ||
          character.subtype === 'companion'
        ) {
          await this.characterService.setInitiative(
            character,
            character.baseInitiative
          );
        } else {
          await this.characterService.setInitiative(character, 0);
          await this.sendRequest({
            ...initRequest,
            at: new Date(),
            state: 'requested',
            archive: false,
            character: {
              type: 'character',
              characterId: character.characterId,
              campaignId: character.campaignId,
            },
          });
        }
      })
    );
  }
}
