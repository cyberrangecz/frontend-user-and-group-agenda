import {BehaviorSubject, Observable} from 'rxjs';
import {User} from 'kypo2-auth';
import {KypoPaginatedResource} from 'kypo-common';
import {KypoRequestedPagination} from 'kypo-common';
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

  protected selectedUsersToAssignSubject$: BehaviorSubject<User[]> = new BehaviorSubject([]);

  selectedUsersToAssign$: Observable<User[]> = this.selectedUsersToAssignSubject$.asObservable();

  protected selectedAssignedUsersSubject$: BehaviorSubject<User[]> = new BehaviorSubject([]);

  selectedAssignedUsers$: Observable<User[]> = this.selectedAssignedUsersSubject$.asObservable();

  protected selectedGroupsToImportSubject$: BehaviorSubject<Group[]> = new BehaviorSubject([]);

  selectedGroupsToImport$: Observable<Group[]> = this.selectedGroupsToImportSubject$.asObservable();

    /**
   * List of users already assigned to the resource
   */
  abstract assignedUsers$: Observable<KypoPaginatedResource<User>>;

  setSelectedUsersToAssign(users: User[]) {
    this.selectedUsersToAssignSubject$.next(users);
  }

  clearSelectedUsersToAssign() {
    this.selectedUsersToAssignSubject$.next([]);
  }

  setSelectedAssignedUsers(users: User[]) {
    this.selectedAssignedUsersSubject$.next(users);
  }

  clearSelectedAssignedUsers() {
    this.selectedAssignedUsersSubject$.next([]);
  }

  setSelectedGroupsToImport(groups: Group[]) {
    this.selectedGroupsToImportSubject$.next(groups);
  }

  clearSelectedGroupsToImport() {
    this.selectedGroupsToImportSubject$.next([]);
  }

  /**
   * Get users available to assign to resource
   * @param resourceId id of a resource associated with users
   * @param filter filter to be applied on users
   */
  abstract getUsersToAssign(resourceId: number, filter: string): Observable<KypoPaginatedResource<User>>;

  /**
   * Get groups available to assign to resource
   * @param filterValue filter to be applied on users
   */
  abstract getGroupsToImport(filterValue: string): Observable<KypoPaginatedResource<Group>>;

  /**
   * Get users already assigned to the resource
   * @contract MUST update assignedUsers$ observable.
   * @param resourceId id of a resource associated with requested users
   * @param pagination requested pagination
   * @param filterValue filter to be applied on users
   */
  abstract getAssigned(resourceId: number, pagination: KypoRequestedPagination, filterValue: string): Observable<KypoPaginatedResource<User>>;


  /**
   * Assigns selected users to a resource
   * @param resourceId id of a resource to associate with users
   */
  abstract assignSelected(resourceId: number): Observable<any>;

    /**
     * Assigns selected users to a resource
     * @param resourceId id of a resource to associate with users
     * @param users users to assign
     * @param groups groups to import users from
     */
  abstract assign(resourceId: number, users: User[], groups?: Group[]): Observable<any>;

  /**
   * Unassigns users from resource
   * @param resourceId id of resource which association should be cancelled
   * @param users users to unassign
   */
  abstract unassign(resourceId: number, users: User[]): Observable<any>;

    /**
     * Unassigns selected users from resource
     * @param resourceId id of resource which association should be cancelled
     */
  abstract unassignSelected(resourceId: number): Observable<any>;
}
