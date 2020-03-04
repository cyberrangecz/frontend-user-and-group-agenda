import {KypoControlItem} from 'kypo-controls';
import {Observable, of} from 'rxjs';

export class DeleteControlItem extends KypoControlItem {
  static readonly ID = 'delete';

  constructor(count: number, result$: Observable<any>) {
    const label = count > 0 ? `Delete (${count})` : 'Delete';
    const disabled$ = of(count <= 0);
    super(DeleteControlItem.ID, label, 'warn', disabled$, result$);
  }
}
