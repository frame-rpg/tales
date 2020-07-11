import { Component, Input, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'src/types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
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
  @Input() campaign: Observable<Campaign>;
  owner: Observable<User>;
  gm: Observable<User>;
  constructor(
    public auth: AngularFireAuth,
    private userService: UserService,
    private campaignService: CampaignService
  ) {}

  async ngOnInit() {
    const admins = Object.keys(this.character.acl).filter(
      (key) => this.character.acl[key] === 'admin'
    );
    if (admins.length > 0) {
      this.owner = this.userService.get(admins[0]);
    }
    this.gm = this.campaignService.gm(this.campaign);
  }
}
