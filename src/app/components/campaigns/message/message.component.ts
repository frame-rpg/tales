import { Component, Input, OnInit } from '@angular/core';

import { Character } from 'types/character';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from 'src/app/data/character.service';
import { Message } from 'types/message';
import { Observable } from 'rxjs';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  character: Observable<Character>;

  constructor(private characterService: CharacterService) {}

  ngOnInit() {
    this.character = this.characterService.get(this.message.to as CharacterId);
  }
}
