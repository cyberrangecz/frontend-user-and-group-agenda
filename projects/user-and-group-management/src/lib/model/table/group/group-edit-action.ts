import {EditAction} from 'kypo2-table';
import {Observable} from 'rxjs';

export class GroupEditAction extends EditAction {

  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Edit group', disabled$, result$);
  }
}
