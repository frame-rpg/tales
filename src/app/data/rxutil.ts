import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable, OperatorFunction } from 'rxjs';

import { arrayToRecord } from './util';
import { map } from 'rxjs/operators';

export function addId<T>(
  key: string
): OperatorFunction<Action<DocumentSnapshot<T>>, T> {
  return (input) =>
    input.pipe(
      map((doc) => ({ ...doc.payload.data(), [key]: doc.payload.id }))
    );
}

export function mapById<T, K extends keyof T>(
  key: K
): OperatorFunction<T[], Record<string, T>> {
  return (input) => input.pipe(map((v) => arrayToRecord(v, key)));
}
