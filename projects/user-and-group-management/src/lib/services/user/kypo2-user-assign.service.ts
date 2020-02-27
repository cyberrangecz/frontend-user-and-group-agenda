import {BehaviorSubject, Observable} from 'rxjs';
import {User} from 'kypo2-auth';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {RequestedPagination} from '../../model/other/requested-pagination';
import {Group} from '../../model/group/group.model';

  /**
  * A layer between a component and an API service. Implement a concrete service by extending this class.
  * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
  * You can use get methods to get paginated requests and other operations to modify data.
  * Subscribe to assignedUsers$ to receive latest data updates.
  */
export abstract class Kypo2UserAssignService {
  protected hasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /**
     * True if error was returned from API, false otherwise
     */
  hasError$: Observable<boolean> = this.hasErrorSubject$.asObservable();

  protected isLoadingAssignedSubject$ = new BehaviorSubject<boolean>(false);
    /**
     * True if service is waiting on response from API for request to get assigned users
     */
  isLoadingAssigned$: Observable<boolean> = this.isLoadingAssignedSubject$.asObservable();

  /**
   * List of users already assigned to the resource
   */
  abstract assignedUsers$: Observable<PaginatedResource<User>>;

  /**
   * Get users available to assign to resource
   * @param resourceId id of a resource associated with users
   * @param filter filter to be applied on users
   */
  abstract getUsersToAssign(resourceId: number, filter: string): Observable<PaginatedResource<User>>;

  /**
   * Get groups available to assign to resource
   * @param filterValue filter to be applied on users
   */
  abstract getGroupsToImport(filterValue: string): Observable<PaginatedResource<Group>>;

  /**
   * Get users already assigned to the resource
   * @contract MUST update assignedUsers$ observable.
   * @param resourceId id of a resource associated with requested users
   * @param pagination requested pagination
   * @param filterValue filter to be applied on users
   */
  abstract getAssigned(resourceId: number, pagination: RequestedPagination, filterValue: string): Observable<PaginatedResource<User>>;


  /**
   * Assigns selected users to a resource
   * @param resourceId id of a resource to associate with users
   * @param users users to assign to a resource
   * @param groups groups to import to a resource (assign groups' users to a resource)
   */
  abstract assign(resourceId: number, users: User[], groups: Group[]): Observable<any>;

  /**
   * Unassigns selected users from resource
   * @param resourceId id of resource which association should be cancelled
   * @param users users to be unassigned from a resource
   */
  abstract unassign(resourceId: number, users: User[]): Observable<any>;
}
