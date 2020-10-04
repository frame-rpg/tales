import { Component, Input, OnInit } from '@angular/core';

import { User } from 'types/user';

@Component({
  selector: 'framesystem-user-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent {
  @Input('user') user: User;
  @Input('max') max: string = '50px';

  get initials(): string {
    return (this.user?.name || 'Frame System')
      .split(' ')
      .map((v) => v[0])
      .join('')
      .toLocaleUpperCase();
  }

  constructor() {}
}
