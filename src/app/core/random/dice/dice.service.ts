import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DiceService {
  constructor() {}

  async rollD12() {
    return Math.floor(Math.random() * 12) + 1;
  }

  async roll(n: number, k: number) {
    const rolls = await Promise.all(
      new Array(Math.abs(n) + 1).fill(0).map(this.rollD12)
    );
    if (n < 0) {
      return {
        result: Math.min(...rolls) + k,
        rolls,
      };
    } else {
      return {
        result: Math.max(...rolls) + k,
        rolls,
      };
    }
  }
}
