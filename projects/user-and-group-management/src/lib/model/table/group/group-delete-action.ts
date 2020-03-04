import {Observable} from 'rxjs';
import {DeleteAction} from '../actions/delete-action';

export class GroupDeleteAction extends DeleteAction {
  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Delete group', disabled$, result$);
  }
}
