export interface Ability {
  name: string;
  description: string;
  cost?: {
    initiative?: number;
    pool?: number;
  };
  damage?: number;
  inherentEdge?: number;
  keywords?: string[];
}
