import {Observable} from 'rxjs';
import {Group} from '../../model/group/group.model';
import {GroupChangedEvent} from '../../model/events/group-changed-event';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 * Subscribe to group$ to receive latest data updates.
 */

export abstract class GroupEditService {

  /**
   * @contract must be updated every time new data are received
   */
  abstract group$: Observable<Group>;

  /**
   * True if existing group is edited, false if new is created
   */
  abstract editMode$: Observable<boolean>;

  /**
   * True if save is disabled (for example invalid data), false otherwise
   */
  abstract saveDisabled$: Observable<boolean>;

  /**
   * Sets group for editing
   * @param group group to be edited
   */
  abstract set(group: Group);

  /**
   * Saves/creates edited group
   */
  abstract save(): Observable<any>;

  /**
   * Creates group and continues to edit it
   */
  abstract createAndEdit(): Observable<any>;

  /**
   * Handles change in edited group
   * @param changeEvent event of edited group
   */
  abstract change(changeEvent: GroupChangedEvent);
}
