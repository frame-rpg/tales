export interface RollRequest {
  skill: string[];
  target?: number;
  requester: string;
  roller: {
    character: string;
    player: string;
  };
}
