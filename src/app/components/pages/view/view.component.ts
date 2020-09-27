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
  ViewRef,
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
import { MatSidenav } from '@angular/material/sidenav';
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
  @ViewChild('content') scrollRoot: ElementRef;
  @ViewChild('drawer') drawer: MatSidenav;

  idSubject = new BehaviorSubject<PageId>(null);
  page: Observable<Page>;
  markdown: Observable<string>;
  narrow: Observable<boolean>;

  destroyingSubject = new BehaviorSubject<boolean>(false);
  destroying = this.destroyingSubject.asObservable().pipe(filter((s) => s));

  contentsSubject = new BehaviorSubject<ContentsElement[]>([]);
  contents = this.contentsSubject.asObservable();
  currentToc = new BehaviorSubject<HTMLHeadingElement[]>([]);

  zoomSubject = new Subject<{ event: MouseEvent; el: HTMLElement }>();

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
    this.narrow = this.breakpoint.observe('(max-width: 750px)').pipe(
      map(({ matches }) => matches),
      publishReplay(1),
      refCount()
    );
    combineLatest([this.narrow, this.zoomSubject.asObservable()])
      .pipe(
        distinctUntilChanged((a, b) => a[1] == b[1]),
        takeUntil(this.destroying)
      )
      .subscribe(([narrow, { el }]) => {
        if (narrow) {
          this.drawer.close();
        }
        el.scrollIntoView({ behavior: 'smooth' });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._pageId) {
      this.idSubject.next(this._pageId);
    }
  }

  ngOnDestroy() {
    this.destroyingSubject.next(true);
  }

  calculateContents() {
    const headers: HTMLHeadingElement[] = Array.from(
      this.md.element.nativeElement.querySelectorAll('h1, h2')
    );
    this.contentsSubject.next(
      headers.map((el) => ({
        inView: false,
        text: el.textContent,
        level: parseInt(el.tagName[1], 10) - 1,
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
        root: this.scrollRoot.nativeElement,
        rootMargin: '0px',
        threshold: 1,
      }
    );
    headers.forEach((el) => observer.observe(el));
    this.cdr.detectChanges();
  }

  scrollTo(el: HTMLElement, event: MouseEvent) {
    this.zoomSubject.next({ event, el });
  }

  ngAfterViewInit() {
    this.md.ready
      .pipe(takeUntil(this.destroying))
      .subscribe(() => this.calculateContents());
  }
}
