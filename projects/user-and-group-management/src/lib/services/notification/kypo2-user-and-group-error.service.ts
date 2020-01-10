import {Injectable} from '@angular/core';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Observable, Subject} from 'rxjs';

/**
 * Service emitting errors from user and group library. Client must subscribe to the error$ observable and handle it.
 */
@Injectable()
export class Kypo2UserAndGroupErrorService {
  private errorSubject: Subject<Kypo2UserAndGroupError> = new Subject();
  /**
   * Subscribe to receive errors emitted from the user and group library
   */
  error$: Observable<Kypo2UserAndGroupError> = this.errorSubject.asObservable();

  /**
   * Emits error to all observers
   * @param error error to be emitted
   */
  emit(error: Kypo2UserAndGroupError) {
    this.errorSubject.next(error);
  }
}
