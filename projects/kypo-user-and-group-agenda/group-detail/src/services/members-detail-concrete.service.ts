import { Injectable } from '@angular/core';
import { RequestedPagination, PaginatedResource, SentinelPagination } from '@sentinel/common';
import { UserApi } from '@muni-kypo-crp/user-and-group-api';
import { User } from '@muni-kypo-crp/user-and-group-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserFilter, UserAndGroupContext } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { UserAndGroupErrorHandler } from '@muni-kypo-crp/user-and-group-agenda';
import { MembersDetailService } from './members-detail.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get users assigned to resource and users/groups available to assign and perform assignment modifications.
 */
@Injectable()
export class MembersDetailConcreteService extends MembersDetailService {
  constructor(
    private userApi: UserApi,
    private context: UserAndGroupContext,
    private errorHandler: UserAndGroupErrorHandler
  ) {
    super();
  }

  private lastAssignedPagination: RequestedPagination;
  private lastAssignedFilter: string;

  private assignedUsersSubject$: BehaviorSubject<PaginatedResource<User>> = new BehaviorSubject(this.initSubject());
  /**
   * Subscribe to receive assigned users
   */
  assignedUsers$: Observable<PaginatedResource<User>> = this.assignedUsersSubject$.asObservable();

  /**
   * Gets users assigned to a resource with passed pagination and updates related observables or handles an error
   * @param resourceId id of a resource associated with requested users
   * @param pagination requested pagination
   * @param filterValue filter to be applied on users
   */
  getAssigned(
    resourceId: number,
    pagination: RequestedPagination,
    filterValue: string = null
  ): Observable<PaginatedResource<User>> {
    const filter = filterValue ? [new UserFilter(filterValue)] : [];
    this.lastAssignedPagination = pagination;
    this.lastAssignedFilter = filterValue;
    this.hasErrorSubject$.next(false);
    this.isLoadingAssignedSubject$.next(true);
    return this.userApi.getUsersInGroups([resourceId], pagination, filter).pipe(
      tap(
        (paginatedUsers) => {
          this.assignedUsersSubject$.next(paginatedUsers);
          this.isLoadingAssignedSubject$.next(false);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching users');
          this.isLoadingAssignedSubject$.next(false);
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }

  private initSubject() {
    return new PaginatedResource([], new SentinelPagination(0, 0, this.context.config.defaultPaginationSize, 0, 0));
  }
}
