import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  publishReplay,
  refCount,
  scan,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'framesystem-spinner',
  template: `
    <div class="spinner">
      <button mat-icon-button (click)="emit(-1)">
        <mat-icon>remove_circle_outline</mat-icon>
      </button>
      <div class="value">{{ current | async }}</div>
      <button mat-icon-button (click)="emit(1)">
        <mat-icon>add_circle_outline</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .spinner {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1 0 auto;
        min-width: 100px;
        justify-content: space-between;
      }
    `,
  ],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input('max') max: number;
  @Input('min') min: number;
  @Input('initial') initial: number;

  @Output() value = new EventEmitter();

  destroying_ = new BehaviorSubject<boolean>(false);
  destroying = this.destroying_.asObservable().pipe(filter((v) => v));
  eventStream = new Subject<number>();
  current: Observable<number>;

  constructor() {}

  ngOnDestroy(): void {
    this.destroying_.next(true);
  }

  ngOnInit(): void {
    this.current = this.eventStream.asObservable().pipe(
      scan((acc: number, curr: number) => {
        if (curr === 0) {
          return clamp(this.initial || 0, this.min, this.max);
        } else {
          return clamp(acc + curr, this.min, this.max);
        }
      }, clamp(this.initial || 0, this.min, this.max)),
      startWith(clamp(this.initial || 0, this.min, this.max)),
      publishReplay(1),
      refCount()
    );
    this.current
      .pipe(takeUntil(this.destroying), distinctUntilChanged())
      .subscribe((v) => this.value.next(v));
    this.value.next(clamp(this.initial || 0, this.min, this.max));
  }

  emit(v: number) {
    this.eventStream.next(v);
  }
}

function clamp(
  v: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY
) {
  return Math.max(Math.min(v, max), min);
}
