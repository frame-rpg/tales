import { CampaignId, CharacterId, Id, UserId } from 'types/idtypes';

import { campaign } from 'admin/src/campaign';

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

export function idPluck<T extends Id>(id: T): Id & Pick<T, 'type'> {
  if (id.type === 'campaign') {
    return pick(id as CampaignId, 'type', 'campaignId');
  } else if (id.type === 'character') {
    return pick(id as CharacterId, 'type', 'characterId', 'campaignId');
  } else if (id.type === 'user') {
    return pick(id as UserId, 'type', 'userId');
  }
}
