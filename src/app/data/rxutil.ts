import { Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable, OperatorFunction } from 'rxjs';

import { map } from 'rxjs/operators';

// export function addId(key: string) {
//   return (input) =>
//     input.pipe(
//       map((doc: any) => ({ ...doc.payload.data(), [key]: doc.payload.id }))
//     );
// }

export function addId<T>(
  key: string
): OperatorFunction<Action<DocumentSnapshot<T>>, T> {
  return (input) =>
    input.pipe(
      map((doc) => ({ ...doc.payload.data(), [key]: doc.payload.id }))
    );
}
