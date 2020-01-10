import {BehaviorSubject, Observable} from 'rxjs';

/**
 * Abstract class containing common observables for any service handling paginated data
 */
export abstract class PaginatedResourceService {
  protected totalLengthSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  totalLength$: Observable<number> = this.totalLengthSubject.asObservable();

  protected hasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: Observable<boolean> = this.hasErrorSubject$.asObservable();
}
