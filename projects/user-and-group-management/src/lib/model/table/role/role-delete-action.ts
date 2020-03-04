import {DeleteAction} from '../actions/delete-action';
import {Observable} from 'rxjs';

export class RoleDeleteAction extends DeleteAction {

  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Delete role', disabled$, result$);
  }
}
