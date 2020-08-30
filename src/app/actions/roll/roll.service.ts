import { Injectable } from '@angular/core';
import { MessageService } from 'src/app/data/message.service';

@Injectable({
  providedIn: 'root',
})
export class RollService {
  constructor(private messageService: MessageService) {}
}
