import { Acl } from '../../types/acl';
import { User } from '../../types/user';

// These values are relatively stable - they only change when the actual
// auth map is reset. Name maps are for people who haven't logged in yet
// so we haven't grabbed their auth uid
const nameMap: Record<string, string> = {
  eric: 'E1gXs41G1mgiM441XXf14ac7ypb2',
  matthew: 'matthew',
  guy: 'guy',
  megan: 'megan',
  phil: 'phil',
  chrissy: 'chrissy',
};

export function updateAcl<T>(item: T): T {
  return JSON.parse(
    Object.entries(nameMap)
      .filter(([key, val]) => key !== val)
      .reduce((acc, [key, val]) => acc.replace(key, val), JSON.stringify(item))
  );
}

export const users: User[] = [
  {
    name: 'Eric',
    id: 'eric',
    avatar: '',
    email: '',
  },
  {
    name: 'Chrissy',
    id: 'chrissy',
    avatar: '',
    email: '',
  },
  {
    name: 'Matthew',
    id: 'matthew',
    avatar: '',
    email: 'llahwehttam',
  },
  {
    name: 'Megan',
    id: 'megan',
    avatar: '',
    email: '',
  },
  {
    name: 'Guy',
    id: 'guy',
    avatar: '',
    email: '',
  },
  {
    name: 'Phil',
    id: 'phil',
    avatar: '',
    email: '',
  },
];
