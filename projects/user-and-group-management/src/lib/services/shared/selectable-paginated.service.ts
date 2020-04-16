import { KypoPaginatedResourceService } from 'kypo-common';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class SelectablePaginatedService<T> extends KypoPaginatedResourceService<T> {
  protected constructor(pageSize: number) {
    super(pageSize);
  }

  protected selectedSubject$: BehaviorSubject<T[]> = new BehaviorSubject([]);
  selected$: Observable<T[]> = this.selectedSubject$.asObservable();

  setSelection(selection: T[]) {
    this.selectedSubject$.next(selection);
  }

  clearSelection() {
    this.selectedSubject$.next([]);
  }
}
