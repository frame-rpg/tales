import {
  ConcreteCost,
  Cost,
  DepletionCost,
  HealthCost,
  InitiativeCost,
  PoolCost,
  WoundCost,
} from 'types/cost';
import { RollRequest, RollResult } from 'types/roll';

import { AngularFirestore } from '@angular/fire/firestore';
import { CharacterService } from '../components/characters/character.service';
import { Injectable } from '@angular/core';
import { SkilledCharacter } from 'types/character';
import { WoundService } from '../actions/wound/wound.service';

@Injectable({
  providedIn: 'root',
})
export class CostService {
  constructor(
    private characterService: CharacterService,
    private firestore: AngularFirestore,
    private woundService: WoundService
  ) {}

  handleInitiativeCosts(
    costs: InitiativeCost[],
    character: SkilledCharacter
  ): any {
    return {
      initiative: costs.reduce(
        (acc, curr: InitiativeCost) => acc + (curr.cost.cost as number),
        character.initiative || 0
      ),
    };
  }

  handlePoolCosts(costs: PoolCost[], character: SkilledCharacter): any {
    return Object.fromEntries(
      Object.entries(
        costs.reduce<Record<string, number>>(
          (acc, curr: PoolCost & ConcreteCost) => ({
            ...acc,
            [curr.pool[0]]: (acc[curr.pool[0]] || 0) + curr.cost.cost,
          }),
          {}
        )
      ).map(([attr, cost]) => [
        `attributes.${attr}.current`,
        Math.max(character.attributes[attr]?.current - cost, 0),
      ])
    );
  }

  handleDepletionCosts(
    costs: DepletionCost[],
    character: SkilledCharacter
  ): any {
    return costs.reduce((acc, depletion: DepletionCost) => {
      const diceCount = Math.abs(depletion.level) + 1;
      const dice = new Array(diceCount)
        .fill(0)
        .map((v) => Math.floor(Math.random() * 12) + 1);
      const roll = depletion.level < 0 ? Math.min(...dice) : Math.max(...dice);
      console.log({ depletion, roll });
      if (roll < depletion.target) {
        return {
          ...acc,
          [`equipment.${depletion.item.itemId}.depleted`]: true,
        };
      } else {
        return acc;
      }
    }, {});
  }

  async handleHealthCosts(
    costs: HealthCost[],
    character: SkilledCharacter
  ): Promise<any> {
    await Promise.all(
      costs.map(async (cost) => {
        await this.firestore
          .collection<RollRequest>(`/campaigns/${character.campaignId}/rolls`)
          .add({
            at: new Date(),
            type: 'health',
            assets: 0,
            // TODO: sigh at that cost.cost.cost
            target: cost.cost.cost as number,
            edge: 0,
            state: 'requested',
            abilities: [],
            archive: false,
            character: {
              characterId: character.characterId,
              campaignId: character.campaignId,
              type: 'character',
            },
          });
      })
    );
  }

  async handleWoundCost(
    costs: WoundCost[],
    character: SkilledCharacter
  ): Promise<any> {
    const wounds = await costs.reduce(async (prom, wound) => {
      const woundList = await prom;
      const newWound = await this.woundService.triggerWound(character, false);
      return woundList.concat(newWound);
    }, Promise.resolve([]));
    return wounds.reduce(
      (acc, curr) => ({
        ...acc,
        [`attributes.${curr}.wound`]: true,
        [`attributes.${curr}.current`]: 0,
      }),
      {}
    );
  }

  async handleCosts(costs: Cost[], character: SkilledCharacter) {
    const initiativeCosts = costs.filter(
      (cost) => cost.type === 'initiative' && cost.cost.type === 'concrete'
    ) as InitiativeCost[];
    const initiativePatch = this.handleInitiativeCosts(
      initiativeCosts,
      character
    );

    const poolCosts = costs.filter(
      (cost) => cost.type === 'pool' && cost.cost.type === 'concrete'
    ) as PoolCost[];
    const poolPatch = this.handlePoolCosts(poolCosts, character);

    const depletionCosts = costs.filter(
      (cost) => cost.type === 'depletion'
    ) as DepletionCost[];
    const depletionPatch = this.handleDepletionCosts(depletionCosts, character);

    const woundCosts = costs.filter(
      (cost) => cost.type === 'wound'
    ) as WoundCost[];
    const woundPatch = await this.handleWoundCost(woundCosts, character);

    const healthCosts = costs.filter(
      (cost) => cost.type === 'health'
    ) as HealthCost[];
    // there is no patch for health costs
    await this.handleHealthCosts(healthCosts, character);

    const characterPatch = {
      ...initiativePatch,
      ...poolPatch,
      ...depletionPatch,
      ...woundPatch,
    };
    if (Object.keys(characterPatch).length > 0) {
      await this.characterService.update(character, characterPatch);
    }
  }
}
