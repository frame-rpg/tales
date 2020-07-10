import { Acl } from '../../types/acl';
import { User } from '../../types/user';

// These values are relatively stable - they only change when the actual
// auth map is reset. Name maps are for people who haven't logged in yet
// so we haven't grabbed their auth uid
const nameMap: Record<string, string> = {
  'eric.eslinger@gmail.com': 'E1gXs41G1mgiM441XXf14ac7ypb2',
  'llahwehttam@gmail.com': 'llahwehttam',
  'guy@albertelli.com': 'guy',
  'megan@albertelli.com': 'megan',
  'phil.bowen@gmail.com': 'phil.bowen',
  'cljacobs1975@gmail.com': 'cljacobs1975',
};

export function updateAcl<T extends { acl: Acl }>(item: T): T {
  return {
    ...item,
    acl: Object.entries(item.acl)
      .filter(([key]) => !!nameMap[key])
      .reduce(
        (acc: Acl, [key, value]) => ({ ...acc, [nameMap[key]]: value }),
        {}
      ),
  };
}

export const users: User[] = [
  {
    name: 'Eric',
    id: 'E1gXs41G1mgiM441XXf14ac7ypb2',
    avatar: '',
    email: '',
  },
  {
    name: 'Chrissy',
    id: 'cljacobs1975',
    avatar: '',
    email: '',
  },
  {
    name: 'Matthew',
    id: 'llahwehttam',
    avatar: '',
    email: 'llahwehttam@gmail.com',
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
    id: 'phil.bowen',
    avatar: '',
    email: '',
  },
];
