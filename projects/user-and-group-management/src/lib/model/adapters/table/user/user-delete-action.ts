import {Observable} from 'rxjs';
import {DeleteAction} from 'kypo2-table';

export class UserDeleteAction extends DeleteAction {

  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Delete user', disabled$, result$);
  }
}
