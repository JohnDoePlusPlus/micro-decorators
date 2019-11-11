import * as hash from 'object-hash';

import { CircuitState } from '../CircuitState';
import { CircuitStateStorage } from '.';

export class ArgumentsCircuit implements CircuitStateStorage {

  private readonly argumentsStorage = new Map<string, CircuitState>();

  constructor(private readonly circuitStateFunction: () => CircuitState) { }

  public get(args: any[]): CircuitState {
    const key = hash(args);
    if (!this.argumentsStorage.has(key)) {
      this.argumentsStorage.set(key, this.circuitStateFunction());
    }

    return this.argumentsStorage.get(key);
  }

}
