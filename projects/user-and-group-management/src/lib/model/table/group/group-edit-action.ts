import {RowAction} from 'kypo2-table';
import {Observable} from 'rxjs';

export class GroupEditAction extends RowAction {

  static readonly ID = 'edit';

  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super(GroupEditAction.ID, 'Edit', 'edit', 'primary', 'Edit group', disabled$, result$);
  }
}
