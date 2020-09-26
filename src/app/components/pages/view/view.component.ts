import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  merge,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkScrollable } from '@angular/cdk/overlay';
import { MarkdownComponent } from 'ngx-markdown';
import { Page } from 'types/page';
import { PageId } from 'types/idtypes';

interface ContentsElement {
  el: HTMLHeadingElement;
  text: string;
  inView: boolean;
}

@Component({
  selector: 'tales-page-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input('pageId') _pageId?: PageId;
  @ViewChild('content') md: MarkdownComponent;
  @ViewChild('content') scrollRoot: CdkScrollable;

  idSubject = new BehaviorSubject<PageId>(null);
  page: Observable<Page>;
  markdown: Observable<string>;
  narrow: Observable<boolean>;

  destroyingSubject = new BehaviorSubject<boolean>(false);
  destroying = this.destroyingSubject.asObservable().pipe(filter((s) => s));

  contentsSubject = new BehaviorSubject<ContentsElement[]>([]);
  contents = this.contentsSubject.asObservable();
  currentToc = new BehaviorSubject<HTMLHeadingElement[]>([]);

  constructor(
    private firestore: AngularFirestore,
    private breakpoint: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.page = this.idSubject.asObservable().pipe(
      distinctUntilChanged(),
      filter((v) => !!v),
      switchMap((id) =>
        this.firestore
          .doc<Page>(`/pages/${id.collectionId}/pages/${id.pageId}`)
          .valueChanges()
          .pipe(map((v) => ({ ...v, ...id })))
      )
    );
    this.narrow = this.breakpoint.observe('(max-width: 660px)').pipe(
      map(({ matches }) => matches),
      publishReplay(1),
      refCount()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._pageId) {
      console.log('nexting');
      this.idSubject.next(this._pageId);
    }
  }

  ngOnDestroy() {
    this.destroyingSubject.next(true);
  }

  calculateContents() {
    const headers: HTMLHeadingElement[] = Array.from(
      this.md.element.nativeElement.querySelectorAll('h1, h2, h3, h4')
    );
    this.contentsSubject.next(
      headers.map((el) => ({
        inView: false,
        text: el.textContent,
        el: el,
      }))
    );

    const observer = new IntersectionObserver(
      (c) => {
        c.forEach(
          (intersecting) =>
            (intersecting.target['inView'] = intersecting.isIntersecting)
        );
      },
      {
        root: this.scrollRoot.getElementRef().nativeElement,
        rootMargin: '0px',
        threshold: 1,
      }
    );
    console.log(this.scrollRoot.getElementRef().nativeElement);
    headers.forEach((el) => observer.observe(el));
    this.cdr.detectChanges();
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  ngAfterViewInit() {
    this.md.ready
      .pipe(takeUntil(this.destroying))
      .subscribe(() => this.calculateContents());
  }
}
