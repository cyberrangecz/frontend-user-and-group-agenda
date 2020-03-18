import {DeleteAction} from 'kypo2-table';
import {Observable} from 'rxjs';

export class RoleDeleteAction extends DeleteAction {

  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Delete role', disabled$, result$);
  }
}
