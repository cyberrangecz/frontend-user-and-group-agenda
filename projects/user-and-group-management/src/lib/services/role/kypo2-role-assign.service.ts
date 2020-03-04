import {BehaviorSubject, Observable} from 'rxjs';
import {User, UserRole} from 'kypo2-auth';
import {PaginatedResource} from '../../model/table/paginated-resource';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 * Subscribe to assignedRoles$ to receive latest data updates.
 */
export abstract class Kypo2RoleAssignService {

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

  protected selectedRolesToAssignSubject$: BehaviorSubject<UserRole[]> = new BehaviorSubject([]);
  selectedRolesToAssign$: Observable<UserRole[]> = this.selectedRolesToAssignSubject$;

  protected selectedAssignedRolesSubject$: BehaviorSubject<UserRole[]> = new BehaviorSubject([]);
  selectedAssignedRoles$: Observable<UserRole[]> = this.selectedAssignedRolesSubject$.asObservable();

  /**
   * List of roles already assigned to the resource
   */
  abstract assignedRoles$: Observable<UserRole[]>;

  setSelectedRolesToAssign(roles: UserRole[]) {
    this.selectedRolesToAssignSubject$.next(roles);
  }

  clearSelectedRolesToAssign() {
    this.selectedRolesToAssignSubject$.next([]);
  }

  setSelectedAssignedRoles(roles: UserRole[]) {
    this.selectedAssignedRolesSubject$.next(roles);
  }

  clearSelectedAssignedRoles() {
    this.selectedAssignedRolesSubject$.next([]);
  }

  /**
   * Search for roles available to assign to resource
   * @param filter filter to be applied on roles
   */
  abstract getAvailableToAssign(filter: string): Observable<PaginatedResource<UserRole>>;

  /**
   * Get roles already assigned to the resource
   * @contract MUST update assignedRoles observable.
   * @param resourceId id of a resource associated with roles
   */
  abstract getAssigned(resourceId: number): Observable<UserRole[]>;

  /**
   * Assigns roles to a resource
   * @param resourceId id of a resource to associate with selected roles
   * @param roles user roles to assign to a resource
   */
  abstract assign(resourceId: number, roles: UserRole[]): Observable<any>;

  /**
   * Assigns selected roles to a resource
   * @param resourceId id of a resource to associate with selected roles
   */
  abstract assignSelected(resourceId: number): Observable<any>;

  /**
   * Unassigns roles from resource
   * @param resourceId id of a resource which association with roles should be cancelled
   * @param roles roles to unassigned from a resource
   */
  abstract unassign(resourceId: number, roles: UserRole[]): Observable<any>;

  /**
   * Unassigns selected roles from resource
   * @param resourceId id of a resource which association with roles should be cancelled
   */
  abstract unassignSelected(resourceId): Observable<any>;
}
