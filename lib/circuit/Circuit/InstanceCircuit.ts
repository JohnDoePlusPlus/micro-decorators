import { CircuitState } from '../CircuitState/CircuitState';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { methodExecution } from '../MethodExecution/MethodExecution';
import { Circuit } from './Circuit';
import { ClassType } from '../../interfaces/class';

export class InstanceCircuit implements Circuit {

  private readonly instancesStorage = new WeakMap<ClassType, CircuitState>();

  private lastError: Error = null;

  constructor(
    private readonly method: (...args: unknown[]) => unknown,
    private readonly circuitState: () => CircuitState,
    private readonly errorHandler: ErrorHandler,
    private readonly errorFilter: (error: Error) => boolean,
  ) { }

  public execute(args: any[], instance: ClassType): unknown {
    const circuitState = this.instanceData(instance);
    const allowExecution = circuitState.allowExecution();
    if (!allowExecution) {
      return this.errorHandler.handle(this.lastError);
    }

    return methodExecution(
      () => this.method(...args),
      this.onSuccess(circuitState),
      this.onError(circuitState),
    );
  }

  private onSuccess(circuitState: CircuitState): () => void {
    return () => {
      circuitState.success();
    };
  }

  private onError(circuitState: CircuitState): (error: Error) => unknown {
    return (error) => {

      if (this.errorFilter(error)) {
        this.lastError = error;
        circuitState.error();
      }

      return this.errorHandler.handle(error);
    };
  }

  private instanceData(instance: ClassType): CircuitState {
    if (!this.instancesStorage.has(instance)) {
      this.instancesStorage.set(instance, this.circuitState());
    }

    return this.instancesStorage.get(instance);
  }

}
