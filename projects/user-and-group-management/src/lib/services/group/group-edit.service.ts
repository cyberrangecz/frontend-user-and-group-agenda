import {Observable} from 'rxjs';
import {Group} from '../../model/group/group.model';
import {ResourceSavedEvent} from '../../model/events/resource-saved-event';
import {GroupChangedEvent} from '../../model/events/group-changed-event';

export abstract class GroupEditService {
  abstract group$: Observable<Group>;
  abstract editMode$: Observable<boolean>;
  abstract saveDisabled$: Observable<boolean>;

  abstract set(group: Group);
  abstract save(): Observable<ResourceSavedEvent>;
  abstract change(changeEvent: GroupChangedEvent);
}
