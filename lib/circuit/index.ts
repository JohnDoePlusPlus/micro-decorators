import { raiseStrategy } from '../utils';
import { isPromise } from '../utils/isPromise';
import { CircuitOptions, DEFAULT_OPTIONS } from './CircuitOptions';
import { CircuitStateFactory } from './CircuitState/factory';
import { CircuitStateStorageFactory } from './CircuitStateStorage/factory';
import { PolicyFactory } from './Policy/factory';

export { CircuitOptions };

/**
 * A circuit breaker.
 * After the method fails `threshold` count it enters the closed state and
 * throws a `Circuit closed.` error. Once in closed state, the circuit fails
 * for the provided `timeout` milliseconds. After the `timeout` interval expires
 * the circuit transitions to half-opened state and allows next execution.
 * If the execution succeeds then circuit transitions back to open state and resets
 * the number of counted errors to zero.
 * @param threshold the max number of failures until the circuit gets closed.
 * @param timeout timeout in milliseconds to keep the circuit in closed state.
 */
export function circuit(
  threshold: number,
  timeout: number,
  options: CircuitOptions = DEFAULT_OPTIONS,
): MethodDecorator {

  const {
    interval,
    onError,
    errorFilter = () => true,
    scope = 'class',
    policy = 'errors',
  } = options;

  const policyFactory = new PolicyFactory(threshold, policy);
  const cirucitStateFactory =
    new CircuitStateFactory(timeout, interval, errorFilter, policyFactory);
  const circuitStateStorage = new CircuitStateStorageFactory(scope, cirucitStateFactory).create();

  const raise = raiseStrategy({ onError }, 'throw');

  return function (_: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method: (...args: any[]) => any = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const state = circuitStateStorage.get(args, this);
      const allowExecution = state.allowExecution();

      if (!allowExecution) {
        return raise(new Error(`@circuit: method ${propertyKey} is blocked.`));
      }

      function successRegister<T = any>(data: T) {
        state.register();

        return data;
      }

      function errorRegister(error: Error) {
        state.register(error);

        return raise(error);
      }

      try {
        const result = method.apply(this, args);

        if (isPromise(result)) {
          return result
            .then(data => successRegister(data))
            .catch(error => errorRegister(error) as any);
        }

        return successRegister(result);
      } catch (error) {
        return errorRegister(error);
      }
    };

    return descriptor;
  };

}
