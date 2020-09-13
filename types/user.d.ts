import { UserId } from './idtypes';

export interface User extends UserId {
  userId: string;
  email: string;
  name?: string;
  avatar?: string;
  rollPreference?: string;
  premium: boolean;
}
