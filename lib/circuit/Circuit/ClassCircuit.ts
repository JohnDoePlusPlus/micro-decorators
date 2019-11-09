import { CircuitState } from '../CircuitState/CircuitState';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { methodExecution } from '../MethodExecution/MethodExecution';
import { Circuit } from './Circuit';

export class ClassCircuit implements Circuit {

  private lastError: Error = null;

  constructor(
    private readonly method: (...args: unknown[]) => unknown,
    private readonly circuitState: CircuitState,
    private readonly errorHandler: ErrorHandler,
    private readonly errorFilter: (error: Error) => boolean,
  ) { }

  public execute(args: any[]): unknown {
    const allowExecution = this.circuitState.allowExecution();
    if (!allowExecution) {
      return this.errorHandler.handle(this.lastError);
    }

    return methodExecution(() => this.method(...args), this.onSuccess(), this.onError());
  }

  private onSuccess(): () => void {
    return () => {
      this.circuitState.success();
    };
  }

  private onError(): (error: Error) => unknown {
    return (error) => {

      if (this.errorFilter(error)) {
        this.lastError = error;
        this.circuitState.error();
      }

      return this.errorHandler.handle(error);
    };
  }

}
