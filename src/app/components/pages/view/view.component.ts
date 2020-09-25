import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Page } from 'types/page';

@Component({
  selector: 'tales-page-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  @Input() collection?: string;
  @Input() page?: string;
  @Input() cat?: boolean;

  pages: Observable<Page[]>;

  constructor() {}

  ngOnInit(): void {}
}
