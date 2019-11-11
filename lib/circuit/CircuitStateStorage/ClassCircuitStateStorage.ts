import { CircuitState } from '../CircuitState';
import { CircuitStateStorage } from '.';

export class ClassCircuit implements CircuitStateStorage {

  private readonly circuitState: CircuitState;

  constructor(circuitStateFunction: () => CircuitState) {
    this.circuitState = circuitStateFunction();
  }

  public get(): CircuitState {
    return this.circuitState;
  }

}
