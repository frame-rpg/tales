import { Component, Input, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Character } from 'src/types/character';
import { User } from 'src/types/user';
import { UserService } from 'src/app/data/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() character: Character;
  owner: User;
  constructor(public auth: AngularFireAuth, private userService: UserService) {}

  async ngOnInit() {
    const admins = Object.keys(this.character.acl).filter(
      (key) => this.character.acl[key] === 'admin'
    );
    if (admins.length > 0) {
      if (admins[0].indexOf('@') >= 0) {
        this.owner = {
          name: admins[0].split('@')[0],
          avatar: '',
          id: admins[0],
          email: admins[0],
        };
      } else {
        this.owner = await this.userService
          .get(admins[0])
          .pipe(take(1))
          .toPromise();
      }
    }
  }
}
