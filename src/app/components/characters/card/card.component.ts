import { Character, SkilledCharacter } from 'types/character';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'types/campaign';
import { CharacterSkill } from 'types/skill';
import { arrayToRecordArray } from '../../../data/util';

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnChanges {
  @Input() character: Character;
  @Input() campaign: Campaign;
  skillCategories: string[] = [];
  skillsByCategory: Record<string, CharacterSkill[]> = {};

  unlocked = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.character.currentValue &&
      changes.character.currentValue !== changes.character.previousValue &&
      changes.character.currentValue.subtype === 'player'
    ) {
      this.skillsByCategory = arrayToRecordArray(
        (changes.character.currentValue as SkilledCharacter).skills,
        'category'
      );
      this.skillCategories = Object.keys(this.skillsByCategory).sort((a, b) =>
        a.localeCompare(b)
      );
    }
  }
}
