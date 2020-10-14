import { Effect } from 'types/effect';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EffectService {
  constructor() {}

  async handleEffects(effects: Effect[]) {}
}
