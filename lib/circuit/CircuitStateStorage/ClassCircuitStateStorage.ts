import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateStorage } from './CircuitStateStorage';

export class ClassCircuit implements CircuitStateStorage {

  constructor(
    private readonly circuitState: CircuitState,
  ) { }

  public get(): CircuitState {
    return this.circuitState;
  }

}
