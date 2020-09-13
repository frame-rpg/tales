import { PlayerCharacter } from './player_character';
import { NonplayerCharacter } from './nonplayer_character';
import { Companion } from './companion';

export * from './player_character';
export * from './nonplayer_character';
export * from './companion';
export * from './character_base';

export type Character = PlayerCharacter | NonplayerCharacter | Companion;
export type SkilledCharacter = PlayerCharacter | Companion;
