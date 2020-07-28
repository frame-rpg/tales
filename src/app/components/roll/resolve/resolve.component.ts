import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisplaySkill } from 'src/types/skill';
import { SkilledCharacter } from 'src/types/character';
import { DisplayAttribute } from 'src/types/attribute';

export interface InjectedData {
  skill: DisplaySkill;
  attributes: DisplayAttribute[];
  character: SkilledCharacter;
}

@Component({
  selector: 'app-resolve',
  templateUrl: './resolve.component.html',
  styleUrls: ['./resolve.component.scss'],
})
export class ResolveComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InjectedData) {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
