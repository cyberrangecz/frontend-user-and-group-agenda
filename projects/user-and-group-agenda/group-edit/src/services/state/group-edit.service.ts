import { Group } from '@crczp/user-and-group-model';
import { Observable } from 'rxjs';
import { GroupChangedEvent } from '../../model/group-changed-event';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 * Subscribe to group-overview$ to receive latest data updates.
 */

export abstract class GroupEditService {
    /**
     * @contract must be updated every time new data are received
     */
    abstract group$: Observable<Group>;

    /**
     * True if existing group-overview is edited, false if new is created
     */
    abstract editMode$: Observable<boolean>;

    /**
     * True if save is disabled (for example invalid data), false otherwise
     */
    abstract saveDisabled$: Observable<boolean>;

    /**
     * Sets group-overview for editing
     * @param group group-overview to be edited
     */
    abstract set(group: Group): void;

    /**
     * Saves/creates edited group-overview
     */
    abstract save(): Observable<any>;

    /**
     * Creates group-overview and continues to state it
     */
    abstract createAndEdit(): Observable<any>;

    /**
     * Handles change in edited group-overview
     * @param changeEvent event of edited group-overview
     */
    abstract change(changeEvent: GroupChangedEvent): void;
}
