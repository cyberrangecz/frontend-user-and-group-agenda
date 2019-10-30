import {HttpErrorResponse} from '@angular/common/http';

export class Kypo2UserAndGroupError {

  err: HttpErrorResponse;
  action: string;

  constructor(err: HttpErrorResponse, action: string) {
    this.err = err;
    this.action = action;
  }
}
