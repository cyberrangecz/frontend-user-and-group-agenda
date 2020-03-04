import {PaginatedResourceService} from './paginated-resources.service';
import {BehaviorSubject, Observable} from 'rxjs';

export abstract class SelectablePaginatedService<T> extends PaginatedResourceService<T> {

  protected selectedSubject$: BehaviorSubject<T[]> = new BehaviorSubject([]);
  selected$: Observable<T[]> = this.selectedSubject$.asObservable();

  setSelection(selection: T[]) {
    this.selectedSubject$.next(selection);
  }

  clearSelection() {
    this.selectedSubject$.next([]);
  }
}
