import { raiseStrategy } from '../utils';
import { CircuitOptions, DEFAULT_ON_ERROR, DEFAULT_OPTIONS } from './CircuitOptions';
import { circuitStateStorageFactory } from './factories/circuitStateStorageFactory';

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

  const circuitStateStorage = circuitStateStorageFactory(threshold, timeout, options);
  const raise = raiseStrategy(options, DEFAULT_ON_ERROR);

  return function (_: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method: (...args: any[]) => any = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const state = circuitStateStorage.get(args, this);
      const allowExecution = state.allowExecution();

      if (!allowExecution) {
        throw raise(new Error(`@circuit: method ${propertyKey} is blocked.`));
      }

      try {
        const result = await method.apply(this, args);

        state.register();

        return result;
      } catch (error) {
        state.register(error);

        return raise(error);
      }
    };

    return descriptor;
  };

}
