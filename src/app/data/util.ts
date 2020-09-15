import { CharacterSkill } from 'types/skill';
import { Id } from 'types/idtypes';
import { Level } from 'types/enums';

export function coerceToDate(input: any): Date {
  if (input instanceof Date) {
    return input;
  } else if (input.toDate) {
    return input.toDate();
  } else {
    return null;
  }
}

export function arrayToRecord<T, K extends keyof T>(
  list: T[],
  key: K
): Record<string, T> {
  return list.reduce(
    (acc, curr) => ({ ...acc, [(curr[key] as unknown) as string]: curr }),
    {}
  );
}

export function arrayToRecordArray<T, K extends keyof T>(
  list: T[],
  key: K
): Record<string, T[]> {
  return list.reduce(
    (acc: Record<string, T[]>, curr: T) => ({
      ...acc,
      [(curr[key] as unknown) as string]: (
        (acc[(curr[key] as unknown) as string] as T[]) || []
      ).concat(curr),
    }),
    {}
  );
}

export function picker<T, K extends keyof T>(
  ...keys: K[]
): (obj: T) => Pick<T, K> {
  return (obj: T) =>
    keys.reduce((acc, curr) => ({ ...acc, [curr]: obj[curr] }), {}) as Pick<
      T,
      K
    >;
}

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, curr) => ({ ...acc, [curr]: obj[curr] }),
    {} as Pick<T, K>
  );
}

export function idPluck(id: Id): Id {
  if (id.type === 'campaign') {
    return pick(id, 'type', 'campaignId');
  } else if (id.type === 'character') {
    return pick(id, 'type', 'characterId', 'campaignId');
  } else if (id.type === 'user') {
    return pick(id, 'type', 'userId');
  }
}

export function skillSort(a: CharacterSkill, b: CharacterSkill): number {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category);
  } else if (a.level !== b.level) {
    return Level[b.level] - Level[a.level];
  } else {
    return a.name.localeCompare(b.name);
  }
}
