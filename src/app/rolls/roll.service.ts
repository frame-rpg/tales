import { InjectedData, ResolveComponent } from './resolve/resolve.component';
import {
  RequestComponent,
  RequestDialogData,
} from './request/request.component';
import { RollMetadata, RollRequest, RollResult } from 'types/roll';

import { AngularFirestore } from '@angular/fire/firestore';
import { CampaignId } from 'types/idtypes';
import { CharacterService } from '../data/character.service';
import { FirebaseApp } from '@angular/fire';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SkilledCharacter } from 'types/character';
import { Weapon } from 'types/equipment';
import { WoundService } from '../actions/wound/wound.service';
import { take } from 'rxjs/operators';

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

  async request<R extends RollRequest>(data: {
    character?: SkilledCharacter;
    skills?: string[];
    weapon?: Weapon;
    type: R['type'];
    self: boolean;
  }) {
    const partialRequest = await this.dialogService
      .open<RequestComponent<R>, RequestDialogData, Partial<R>>(
        RequestComponent,
        {
          data,
        }
      )
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    const meta: RollMetadata = {
      character: data.character,
      at: new Date(),
      archive: false,
      state: 'requested',
    };
    const req: RollRequest = { ...partialRequest, ...meta } as RollRequest;
    if (data.self) {
      await this.resolve(req, data.character);
    } else {
      await this.sendRequest(req);
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
}
