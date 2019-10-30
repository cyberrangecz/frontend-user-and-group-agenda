import {Injectable} from '@angular/core';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class Kypo2UserAndGroupErrorService {
  private errorSubject: Subject<Kypo2UserAndGroupError> = new Subject();
  error$: Observable<Kypo2UserAndGroupError> = this.errorSubject.asObservable();

  emit(error: Kypo2UserAndGroupError) {
    this.errorSubject.next(error);
  }
}
