import * as hash from 'object-hash';

import { CircuitState } from '../CircuitState/CircuitState';
import { CircuitStateStorage } from './CircuitStateStorage';

export class ArgumentsCircuit implements CircuitStateStorage {

  private readonly argumentsStorage = new Map<string, CircuitState>();

  constructor(
    private readonly circuitState: () => CircuitState,
  ) { }

  public get(args: any[]): CircuitState {
    const key = hash(args);
    if (!this.argumentsStorage.has(key)) {
      this.argumentsStorage.set(key, this.circuitState());
    }

    return this.argumentsStorage.get(key);
  }

}
