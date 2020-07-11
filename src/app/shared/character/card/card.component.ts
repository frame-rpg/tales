import { Component, Input, OnInit } from '@angular/core';
import { take, tap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'src/types/campaign';
import { Character } from 'src/types/character';
import { Observable } from 'rxjs';
import { User } from 'src/types/user';
import { UserService } from 'src/app/data/user.service';

@Component({
  selector: 'character-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() character: Character;
  @Input() campaign: Campaign;
  owner: Observable<User>;
  constructor(public auth: AngularFireAuth, private userService: UserService) {}

  async ngOnInit() {
    const admins = Object.keys(this.character.acl).filter(
      (key) => this.character.acl[key] === 'admin'
    );
    if (admins.length > 0) {
      this.owner = this.userService.get(admins[0]);
    }
  }
}
