import { PlayerCharacter, NewPlayerCharacter } from './player_character';
import {
  NonplayerCharacter,
  NewNonplayerCharacter,
} from './nonplayer_character';
import { Companion, NewCompanion } from './companion';

export * from './player_character';
export * from './nonplayer_character';
export * from './companion';
export * from './character_base';

export type Character = PlayerCharacter | NonplayerCharacter | Companion;
export type NewCharacter =
  | NewPlayerCharacter
  | NewNonplayerCharacter
  | NewCompanion;
