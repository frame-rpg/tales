import { Component, Input, OnChanges } from '@angular/core';
import { Observable, Subject, merge } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { Page } from 'types/page';
import { PageId } from 'types/idtypes';

@Component({
  selector: 'tales-page-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnChanges {
  @Input('pageId') _pageId?: PageId;
  @Input('page') _page?: Page;

  idSubject = new Subject<PageId>();
  pageSubject = new Subject<Page>();
  page: Observable<Page>;

  constructor(private firestore: AngularFirestore) {
    this.page = merge(
      this.pageSubject
        .asObservable()
        .pipe(distinctUntilChanged((a, b) => a[0] === b[0])),
      this.idSubject.asObservable().pipe(
        distinctUntilChanged(),
        switchMap((id) =>
          this.firestore
            .doc<Page>(`/pages/${id.collectionId}/pages/${id.pageId}`)
            .valueChanges()
            .pipe(map((v) => ({ ...v, ...id })))
        )
      )
    );
  }

  ngOnChanges(): void {
    if (this._page) {
      this.pageSubject.next(this._page);
    } else if (this._pageId) {
      this.idSubject.next(this._pageId);
    }
  }
}
