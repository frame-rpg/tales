import { Component, Input, OnChanges } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { Page } from 'types/page';

@Component({
  selector: 'tales-page-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnChanges {
  @Input('pageId') _pageId?: string;
  @Input('page') _page?: Page;
  @Input() cat?: boolean;

  idSubject = new Subject<string>();
  pageSubject = new Subject<Page[]>();
  pages: Observable<Page[]>;

  constructor(private firestore: AngularFirestore) {
    this.pages = merge(
      this.pageSubject
        .asObservable()
        .pipe(distinctUntilChanged((a, b) => a[0] === b[0])),
      this.idSubject.asObservable().pipe(
        distinctUntilChanged(),
        switchMap((id) =>
          this.firestore
            .collection<Page>(`/pages/${id}/pages`, (query) =>
              query.where('published', '==', true)
            )
            .valueChanges({ idField: 'pageId' })
        )
      )
    );
  }

  ngOnChanges(): void {
    if (this._page) {
      this.pageSubject.next([this._page]);
    } else if (this._pageId) {
      this.idSubject.next(this._pageId);
    }
  }
}
