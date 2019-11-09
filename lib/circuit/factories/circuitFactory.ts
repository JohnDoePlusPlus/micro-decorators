import { CircuitOptions } from '..';
import { Circuit } from '../Circuit/Circuit';

export function circuitFactory(
  method: (...args: any[]) => any,
  threshold: number,
  timeout: number,
  options?: CircuitOptions,
): Circuit {

  throw new Error('Not implemented');
}
