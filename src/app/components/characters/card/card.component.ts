import { Component, Input } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'types/campaign';
import { Character } from 'types/character';
import { Level } from 'types/enums';

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() character: Character;
  @Input() campaign: Campaign;
  @Input() expanded = false;
  unlocked = false;
  levels = {
    inept: 3,
    unskilled: 2,
    proficient: 1,
    trained: 2,
    expert: 3,
  };

  linearGradient(current: number, max: number) {
    const percentage = Math.floor((current * 100) / max);
    return `
    linear-gradient(90deg, var(--fairy-dark) ${percentage}%, transparent ${
      100 - percentage
    }%)`;
  }

  characterAttributeNames = {
    player: ['might', 'speed', 'conviction', 'focus', 'health'],
    companion: ['loyalty', 'health'],
  };
  constructor(public auth: AngularFireAuth) {}
}
