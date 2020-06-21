import { PlayerCharacter } from './player_character';
import { NonplayerCharacter } from './nonplayer_character';
import { Companion } from './companion';

export type Character = PlayerCharacter | NonplayerCharacter | Companion;
