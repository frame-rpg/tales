import { Action, AngularFirestore } from '@angular/fire/firestore';
import {
  AttackTemplate,
  Initiative,
  InitiativeRequest,
  NoncombatTemplate,
  RequestTemplate,
  RollMetadata,
  RollRequest,
  RollResult,
} from 'types/roll';
import { CampaignId, CharacterId } from 'types/idtypes';
import { Character, SkilledCharacter } from 'types/character';
import {
  ConcreteCost,
  DepletionCost,
  InitiativeCost,
  PoolCost,
} from 'types/cost';
import { InjectedData, ResolveComponent } from './resolve/resolve.component';
import { Observable, of } from 'rxjs';
import {
  RequestComponent,
  RequestDialogData,
} from './request/request.component';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  take,
  tap,
} from 'rxjs/operators';

import { Ability } from 'types/ability';
import { CharacterService } from '../components/characters/character.service';
import { CostService } from './cost.service';
import { FirebaseApp } from '@angular/fire';
import { Injectable } from '@angular/core';
import { Item } from 'types/item';
import { MatDialog } from '@angular/material/dialog';
import { SkillType } from 'types/skill';
import { Weapon } from 'types/equipment';
import { WoundService } from '../actions/wound/wound.service';

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
  ability: Ability;
}

interface DefenseRequestData extends BaseRequestData {
  type: 'defense';
  self: boolean;
  character: SkilledCharacter;
}

interface NoncombatRequestData extends BaseRequestData {
  type: 'noncombat';
  self: boolean;
  character: SkilledCharacter;
  ability?: Ability;
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
    private costService: CostService,
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

  async triggerAction(
    ability: Ability,
    character: SkilledCharacter,
    self: boolean
  ) {
    const data:
      | AttackRequestData
      | NoncombatRequestData
      | DefenseRequestData = {
      self: true,
      type: ability.category as 'attack' | 'noncombat' | 'defense',
      skills: ability.skills,
      character: character,
      ability,
    };
    const partialRequest = (await this.dialogService
      .open<RequestComponent, RequestDialogData, RequestTemplate>(
        RequestComponent,
        {
          data,
        }
      )
      .afterClosed()
      .pipe(take(1))
      .toPromise()) as AttackTemplate | NoncombatTemplate;
    if (!partialRequest) {
      return;
    }
    const adHocPassive: Ability = {
      type: 'passive',
      name: 'Ad hoc ability',
      description: 'Applied during roll trigger',
      costs: [],
      category: ability.category,
      effects: [],
    };

    if ('assets' in partialRequest && partialRequest.assets !== 0) {
      adHocPassive.effects.push({
        duration: 'roll',
        type: 'bonus',
        assets: partialRequest.assets,
      });
    }
    if ('edge' in partialRequest && partialRequest.edge !== 0) {
      adHocPassive.effects.push({
        duration: 'roll',
        type: 'bonus',
        edge: partialRequest.edge,
      });
    }
    if ('damage' in partialRequest && partialRequest.damage !== 0) {
      adHocPassive.effects.push({
        duration: 'roll',
        type: 'bonus',
        damage: partialRequest.damage,
      });
    }
    if ('initiative' in partialRequest && partialRequest.initiative !== 0) {
      adHocPassive.effects.push({
        duration: 'roll',
        type: 'bonus',
        initiative: partialRequest.initiative,
      });
    }

    const meta: Partial<RollMetadata> = {
      at: new Date(),
      archive: false,
      state: 'requested',
    };
    const req = {
      ...partialRequest,
      ...meta,
      abilities: [ability],
    } as RollRequest;

    if (adHocPassive.effects.length > 0) {
      req.abilities.push(adHocPassive);
    }

    if (data.skills) {
      req.skills = data.skills;
    }

    if (self) {
      await this.resolve(
        { ...req, character: pluckCharacterId(data.character) },
        data.character
      );
    } else {
      await this.sendRequest({
        ...req,
        character: pluckCharacterId(data.character),
      });
    }
  }

  async requestInitiative(data: InitiativeRequestData) {
    const partialRequest = await this.dialogService
      .open<RequestComponent, RequestDialogData, RequestTemplate>(
        RequestComponent,
        {
          data,
        }
      )
      .afterClosed()
      .pipe(take(1))
      .toPromise();

    if (!partialRequest) {
      return;
    }
    const adHocPassive: Ability = {
      type: 'passive',
      name: 'Ad hoc ability',
      description: 'Applied during roll trigger',
      costs: [],
      category: 'initiative',
      effects: [],
    };

    if ('assets' in partialRequest && partialRequest.assets !== 0) {
      adHocPassive.effects.push({
        duration: 'roll',
        type: 'bonus',
        assets: partialRequest.assets,
      });
    }
    if ('edge' in partialRequest && partialRequest.edge !== 0) {
      adHocPassive.effects.push({
        duration: 'roll',
        type: 'bonus',
        edge: partialRequest.edge,
      });
    }

    const meta: Partial<RollMetadata> = {
      at: new Date(),
      archive: false,
      state: 'requested',
    };
    const req = {
      ...partialRequest,
      ...meta,
      abilities: [],
    } as InitiativeRequest;
    if (adHocPassive.effects.length > 0) {
      req.abilities.push(adHocPassive);
    }
    if (data.skills) {
      req.skills = data.skills;
    }
    await this.fireInitiativeRequests(data.characters, req);
  }

  async resolve(roll: RollRequest, character: SkilledCharacter) {
    const result = await this.dialogService
      .open<ResolveComponent, InjectedData, RollResult>(ResolveComponent, {
        data: { roll, character },
      })
      .afterClosed()
      .pipe(take(1))
      .toPromise();

    if (!result) {
      return;
    }
    if (result.rollId) {
      await this.firestore
        .doc(`/campaigns/${result.character.campaignId}/rolls/${result.rollId}`)
        .update(result);
    } else {
      await this.firestore
        .collection(`/campaigns/${result.character.campaignId}/rolls`)
        .add(result);
    }

    const costs = result.abilities.flatMap((ability) =>
      ability.costs.map((cost) => {
        if (cost.type === 'depletion') {
          return { ...cost, item: { ...ability.from } };
        }
        return cost;
      })
    );

    const effects = result.abilities.flatMap((ability) =>
      ability.effects.filter((effect) => effect.type === 'bonus')
    );

    await this.costService.handleCosts(costs, character, effects);
    if (roll.type === 'initiative') {
      await this.characterService.update(character, {
        initiative: result.result,
      });
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

  nextRequest(
    campaign: CampaignId,
    characters: CharacterId[]
  ): Observable<RollRequest> {
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
            .orderBy('at', 'desc')
            .limit(1)
      )
      .valueChanges({ idField: 'rollId' })
      .pipe(
        debounceTime(300),
        filter((v) => v?.length > 0),
        map((v: RollRequest[]) => v[0] as RollRequest),
        distinctUntilChanged((a, b) => a?.rollId === b?.rollId)
      );
  }

  async fireInitiativeRequests(
    characters: Character[],
    initRequest: InitiativeRequest
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
            character: pluckCharacterId(character),
          });
        }
      })
    );
  }
}

function pluckCharacterId(c: CharacterId): CharacterId {
  return {
    type: 'character',
    campaignId: c.campaignId,
    characterId: c.characterId,
  };
}
