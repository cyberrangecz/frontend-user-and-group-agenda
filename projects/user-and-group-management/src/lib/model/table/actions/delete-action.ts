import {RowAction} from 'kypo2-table';
import {Observable} from 'rxjs';

export class DeleteAction extends RowAction {

  static readonly ID = 'delete';

  constructor(tooltip: string, disabled$: Observable<boolean>, result$: Observable<any>) {
    super(DeleteAction.ID, 'Delete', 'delete', 'warn', tooltip, disabled$, result$);
  }
}
