import {BehaviorSubject, Observable} from 'rxjs';
import {User} from 'kypo2-auth';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {RequestedPagination} from '../../model/other/requested-pagination';
import {Group} from '../../model/group/group.model';

export abstract class UserAssignService {
  protected hasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  hasError$: Observable<boolean> = this.hasErrorSubject$.asObservable();

  protected isLoadingAssignedSubject$ = new BehaviorSubject<boolean>(false);
  isLoadingAssigned$: Observable<boolean> = this.isLoadingAssignedSubject$.asObservable();

  protected totalLengthSubject = new BehaviorSubject<number>(0);
  totalLength$ = this.totalLengthSubject.asObservable();

  /**
   * List of users already assigned to the resource
   */
  abstract assignedUsers$: Observable<PaginatedResource<User[]>>;

  /**
   * Search for users available to assign to resource
   */
  abstract getUsersToAssign(resourceId: number, filter: string): Observable<PaginatedResource<User[]>>;

  /**
   * Search for groups available to assign to resource
   */
  abstract getGroupsToImport(filterValue: string): Observable<PaginatedResource<Group[]>>;

    /**
   * Get users already assigned to the resource
   * @contract MUST update assignedUsers$ observable.
   */
  abstract getAssigned(resourceId: number, pagination: RequestedPagination, filterValue: string): Observable<PaginatedResource<User[]>>;


  /**
   * Assigns all users to resource
   */
  abstract assign(resourceId: number, users: User[], groups: Group[]): Observable<any>;

  /**
   * Unassigns all users from resource
   */
  abstract unassign(resourceId: number, roles: User[]): Observable<any>;
}
