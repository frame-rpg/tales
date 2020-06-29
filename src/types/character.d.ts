import { PlayerCharacter, NewPlayerCharacter } from './player_character';
import {
  NonplayerCharacter,
  NewNonplayerCharacter,
} from './nonplayer_character';
import { Companion, NewCompanion } from './companion';

export type Character = PlayerCharacter | NonplayerCharacter | Companion;
export type NewCharacter =
  | NewPlayerCharacter
  | NewNonplayerCharacter
  | NewCompanion;
