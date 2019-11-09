import { ErrorHandler } from './ErrorHandler';

export class IgnoreAsyncErrorHandler implements ErrorHandler {

  public handle() {
    return Promise.resolve();
  }

}
