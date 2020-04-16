import { DeleteAction } from 'kypo2-table';
import { Observable } from 'rxjs';

export class UserDeleteAction extends DeleteAction {
  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Delete user', disabled$, result$);
  }
}
