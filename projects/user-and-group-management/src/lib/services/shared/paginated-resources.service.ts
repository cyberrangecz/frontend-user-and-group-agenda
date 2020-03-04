import {BehaviorSubject, Observable} from 'rxjs';
import {PaginatedResource} from '../../model/table/paginated-resource';
import {Pagination} from 'kypo2-table';

/**
 * Abstract class containing common observables for any service handling paginated data
 */
export abstract class PaginatedResourceService<T> {

  protected resourceSubject$: BehaviorSubject<PaginatedResource<T>> = new BehaviorSubject(this.initSubject());

  /**
   * @contract must be updated every time new data are received
   */
  resource$: Observable<PaginatedResource<T>> = this.resourceSubject$.asObservable();

  protected hasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  hasError$: Observable<boolean> = this.hasErrorSubject$.asObservable();

  private initSubject(): PaginatedResource<T> {
    return new PaginatedResource([], new Pagination(0, 0, 10, 0, 0));
  }
}
