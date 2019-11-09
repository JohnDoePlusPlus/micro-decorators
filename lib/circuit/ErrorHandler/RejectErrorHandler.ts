import { ErrorHandler } from './ErrorHandler';

export class RejectErrorHandler implements ErrorHandler {

  public handle(error: Error) {
    return Promise.reject(error);
  }

}
