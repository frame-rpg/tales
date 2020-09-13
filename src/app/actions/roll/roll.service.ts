import { RollComplete, RollRequest } from 'types/message';

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  constructor(private dialogService: MatDialog) {}

  async trigger(
    roll: RollRequest,
    character: SkilledCharacter
  ): Promise<Omit<RollComplete, 'messageId'>> {
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
