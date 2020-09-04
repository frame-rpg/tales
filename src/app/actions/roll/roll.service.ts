import { RollComplete, RollRequest, SentMessage } from 'types/message';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { RollComponent } from './roll.component';
import { SkilledCharacter } from 'types/character';
import { take } from 'rxjs/operators';

interface DialogInput {
  roll: RollRequest;
  character: SkilledCharacter;
}

@Injectable({
  providedIn: 'root',
})
export class RollService {
  constructor(
    private messageService: MessageService,
    private dialogService: MatDialog
  ) {}

  async trigger(
    roll: RollRequest,
    character: SkilledCharacter
  ): Promise<RollComplete> {
    const result = await this.dialogService
      .open<RollComponent, DialogInput, RollComplete>(RollComponent, {
        data: { roll, character },
      })
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    return result;
  }
}
