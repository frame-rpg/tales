import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trackByProperty',
  pure: true,
})
export class TrackByPropertyPipe<T, K extends keyof T>
  implements PipeTransform {
  transform(indexedProperty: K): (index: number, item: T) => any {
    return (_, item) => item[indexedProperty];
  }
}
