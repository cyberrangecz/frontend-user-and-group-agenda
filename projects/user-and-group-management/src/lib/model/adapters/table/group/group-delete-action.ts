import { DeleteAction } from 'kypo2-table';
import { Observable } from 'rxjs';

export class GroupDeleteAction extends DeleteAction {
  constructor(disabled$: Observable<boolean>, result$: Observable<any>) {
    super('Delete group', disabled$, result$);
  }
}
