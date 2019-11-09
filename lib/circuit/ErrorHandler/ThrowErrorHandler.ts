import { ErrorHandler } from './ErrorHandler';

export class ThrowErrorHandler implements ErrorHandler {

  public handle(error: Error) {
    throw error;
  }

}
