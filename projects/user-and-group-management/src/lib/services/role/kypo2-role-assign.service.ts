import {BehaviorSubject, Observable} from 'rxjs';
import {UserRole} from 'kypo2-auth';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';

export abstract class Kypo2RoleAssignService {

  protected hasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: Observable<boolean> = this.hasErrorSubject$.asObservable();

  protected isLoadingAssignedSubject$ = new BehaviorSubject<boolean>(false);
  isLoadingAssigned$: Observable<boolean> = this.isLoadingAssignedSubject$.asObservable();

  /**
   * List of roles already assigned to the resource
   */
  abstract assignedRoles$: Observable<UserRole[]>;

  /**
   * Search for roles available to assign to resource
   */
  abstract getAvailableToAssign(filter: string): Observable<PaginatedResource<UserRole[]>>;

  /**
   * Get roles already assigned to the resource
   * @contract MUST update assignedRoles observable.
   */
  abstract getAssigned(resourceId: number): Observable<UserRole[]>;

  /**
   * Assigns all roles to resource
   */
  abstract assign(resourceId: number, roles: UserRole[]): Observable<any>;

  /**
   * Unassigns all roles from resource
   */
  abstract unassign(resourceId: number, roles: UserRole[]): Observable<any>;
}
