import { UserRole } from '@muni-kypo-crp/user-and-group-model';
import { PaginatedResource, OffsetPaginationEvent, PaginationBaseEvent } from '@sentinel/common/pagination';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated sandbox instances and other operations to modify data.
 */
export abstract class RolesDetailService {
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
   * List of roles already assigned to the resource
   */
  abstract assignedRoles$: Observable<PaginatedResource<UserRole>>;

  /**
   * Get roles already assigned to the resource
   * @contract MUST update assignedRoles observable.
   * @param resourceId id of a resource associated with roles
   * @param pagination requested pagination
   * @param filterValue filter to be applied on result
   */
  abstract getAssigned(
    resourceId: number,
    pagination: PaginationBaseEvent,
    filterValue?: string,
  ): Observable<PaginatedResource<UserRole>>;
}
