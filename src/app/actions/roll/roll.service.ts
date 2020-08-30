import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/data/message.service';
import { RollComponent } from './roll.component';
import { RollRequest } from 'types/message';
import { SkilledCharacter } from 'types/character';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RollService {
  constructor(
    private messageService: MessageService,
    private dialogService: MatDialog
  ) {}

  async trigger(roll: RollRequest, character: SkilledCharacter) {
    const result = await this.dialogService
      .open(RollComponent, { data: { roll, character } })
      .afterClosed()
      .pipe(take(1))
      .toPromise();
    console.log(result);
  }
}
