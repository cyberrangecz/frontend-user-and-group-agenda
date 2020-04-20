/**
 * Service emitting errors from user and group library
 */
import { HttpErrorResponse } from '@angular/common/http';

export abstract class UserAndGroupErrorHandler {
  /**
   * Handles error and displays it in user friendly way
   * @param err http error
   * @param operation description of an operation which caused the error
   */
  abstract emit(err: HttpErrorResponse, operation: string);
}
