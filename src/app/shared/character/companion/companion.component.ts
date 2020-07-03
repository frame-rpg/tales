import { Component, Input } from '@angular/core';

import { Companion } from 'src/types/companion';

@Component({
  selector: 'companion',
  templateUrl: './companion.component.html',
  styleUrls: ['./companion.component.scss'],
})
export class CompanionComponent {
  @Input() character: Companion;
  constructor() {}
}
