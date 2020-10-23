import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Attribute } from 'types/attribute';
import { Character } from 'types/character';

@Component({
  selector: 'framesystem-character-smallcard',
  templateUrl: './smallcard.component.html',
  styleUrls: ['./smallcard.component.scss'],
})
export class SmallcardComponent implements OnInit {
  image =
    'https://firebasestorage.googleapis.com/v0/b/framesystem-rpg.appspot.com/o/01EKPCBGA35XYSMMDS61Y2SKEK?alt=media&token=eb4a0c2a-bca1-4629-be2d-6b11618cd290';

  @Input('character') character: Character;

  constructor() {}

  get currentPool(): number {
    if ('attributes' in this.character) {
      return Object.values(this.character.attributes).reduce(
        (acc, curr: Attribute) => acc + curr.current,
        0
      );
    } else {
      return this.character.health;
    }
  }

  get maxPool(): number {
    if ('attributes' in this.character) {
      return Object.values(this.character.attributes).reduce(
        (acc, curr: Attribute) => acc + curr.pool,
        0
      );
    } else {
      // TODO: make this maxHealth for npcs
      return this.character.health;
    }
  }

  get woundCount(): number {
    if ('attributes' in this.character) {
      return Object.values(this.character.attributes).reduce(
        (acc, curr: Attribute) => acc + (curr.wound ? 1 : 0),
        0
      );
    } else {
      return 0;
    }
  }

  get statusPercent(): number {
    return Math.floor((this.currentPool / this.maxPool) * 100);
  }

  get health(): number {
    if ('attributes' in this.character) {
      return this.character.attributes.health.current;
    } else {
      return this.character.health;
    }
  }

  get status(): string {
    if (this.woundCount > 1) {
      return 'terrible';
    } else if (this.woundCount === 1) {
      return 'bad';
    }
    if (this.statusPercent > 80) {
      return 'great';
    } else if (this.statusPercent > 60) {
      return 'good';
    } else if (this.statusPercent > 40) {
      return 'medium';
    } else if (this.statusPercent > 20) {
      return 'bad';
    } else {
      return 'terrible';
    }
  }

  ngOnInit(): void {}
}
