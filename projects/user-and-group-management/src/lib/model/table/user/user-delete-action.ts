import {Observable} from 'rxjs';
import {DeleteAction} from '../actions/delete-action';

export class UserDeleteAction extends DeleteAction {

  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Delete user', disabled$, result$);
  }
}
