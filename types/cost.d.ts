import { AttributeName } from './attribute';

export interface BaseCalculation {
  type: 'concrete' | 'calculated';
}

export interface ConcreteCalculation extends BaseCalculation {
  type: 'concrete';
  number: number;
}

export interface CalculatedCalculation extends BaseCalculation {
  type: 'calculated';
  formula: string[];
}

export type Calculation = CalculatedCalculation | ConcreteCalculation;

export type CostType = 'pool' | 'initiative' | 'damage';

export interface BaseCost {
  type: CostType;
  cost: Calculation;
}

export interface PoolCost extends BaseCost {
  type: 'pool';
  pool: AttributeName[];
}

export interface InitiativeCost extends BaseCost {
  type: 'initiative';
}

export interface DamageCost extends BaseCost {
  type: 'damage';
  what: { type: string; category: string };
}

export type Cost = PoolCost | InitiativeCost | DamageCost;
export type ConcreteCost = Cost & { cost: ConcreteCalculation };
