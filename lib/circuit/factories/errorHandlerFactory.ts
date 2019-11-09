import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { IgnoreAsyncErrorHandler } from '../ErrorHandler/IgnoreAsyncErrorHandler';
import { IgnoreErrorHandler } from '../ErrorHandler/IgnoreErrorHandler';
import { RejectErrorHandler } from '../ErrorHandler/RejectErrorHandler';
import { ThrowErrorHandler } from '../ErrorHandler/ThrowErrorHandler';

const errorHandlerFactories: ReadonlyMap<
  'throw' | 'reject' | 'ignore' | 'ignoreAsync',
  () => ErrorHandler
> = new Map<'throw' | 'reject' | 'ignore' | 'ignoreAsync', () => ErrorHandler>()
  .set('throw', () => new ThrowErrorHandler())
  .set('reject', () => new RejectErrorHandler())
  .set('ignore', () => new IgnoreErrorHandler())
  .set('ignoreAsync', () => new IgnoreAsyncErrorHandler());

export function errorHadnlerFactory(
  strategy: 'throw' | 'reject' | 'ignore' | 'ignoreAsync',
): ErrorHandler {

  const factory = errorHandlerFactories.get(strategy);
  if (!factory) {
    throw new Error(`@circuit onError can't be: ${strategy}`);
  }

  return factory();
}
