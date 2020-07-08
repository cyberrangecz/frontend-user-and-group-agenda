import { SentinelControlItem } from '@sentinel/components/controls';
import { Observable } from 'rxjs';

export class SaveControlItem extends SentinelControlItem {
  static readonly ID = 'save';

  constructor(label: string, disabled$: Observable<boolean>, result$: Observable<any>) {
    super(SaveControlItem.ID, label, 'primary', disabled$, result$);
  }
}
