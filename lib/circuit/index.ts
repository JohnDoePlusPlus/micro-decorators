import { CircuitOptions } from './CircuitOptions';
import { circuitFactory } from './factories/circuitFactory';

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
  options?: CircuitOptions,
): MethodDecorator {

  return function (_: any, __: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const circuit = circuitFactory(method, threshold, timeout, options);

    descriptor.value = function (...args: any[]) {
      return circuit.execute(args, this);
    };

    return descriptor;
  };

}
