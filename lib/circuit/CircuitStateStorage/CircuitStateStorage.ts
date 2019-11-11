import { ClassType } from '../../interfaces/class';
import { CircuitState } from '../CircuitState';

export interface CircuitStateStorage {
  get(args: any[], instance: ClassType): CircuitState;
}
