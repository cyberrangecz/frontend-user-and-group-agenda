import {HttpErrorResponse} from '@angular/common/http';

/**
 * Event emitted when http error happens inside the user and group library
 */
export class Kypo2UserAndGroupError {

  /**
   * Http error returned by server
   */
  err: HttpErrorResponse;

  /**
   * Name or simple description of action during which error was emitted
   */
  action: string;

  constructor(err: HttpErrorResponse, action: string) {
    this.err = err;
    this.action = action;
  }
}
