import { Injectable } from '@angular/core';
import { RequestedPagination, SentinelPagination, PaginatedResource } from '@sentinel/common';
import { UserApi } from 'kypo-user-and-group-api';
import { GroupApi } from 'kypo-user-and-group-api';
import { User } from 'kypo-user-and-group-model';
import { Group } from 'kypo-user-and-group-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { GroupFilter, UserFilter, UserAndGroupContext } from '@kypo/user-and-group-agenda/internal';
import { UserAndGroupErrorHandler } from '@kypo/user-and-group-agenda';
import { UserAssignService } from './user-assign.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get users assigned to resource and users/groups available to assign and perform assignment modifications.
 */
@Injectable()
export class UserAssignConcreteService extends UserAssignService {
  constructor(
    private api: GroupApi,
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
   * Assigns (associates) selected users or groups to a resource
   * @param resourceId id of a resource with which users and groups should be associated
   */
  assignSelected(resourceId: number): Observable<any> {
    const userIds = this.selectedUsersToAssignSubject$.getValue().map((user) => user.id);
    const groupIds = this.selectedGroupsToImportSubject$.getValue().map((group) => group.id);
    return this.callApiToAssign(resourceId, userIds, groupIds);
  }

  assign(resourceId: number, users: User[], groups?: Group[]): Observable<any> {
    const userIds = users.map((user) => user.id);
    const groupIds = groups.map((group) => group.id);
    return this.callApiToAssign(resourceId, userIds, groupIds);
  }

  /**
   * Unassigns (cancels association) users from a resource
   * @param resourceId id of a resource which association should be canceled
   * @param users users to unassign
   */
  unassign(resourceId: number, users: User[]): Observable<any> {
    const userIds = users.map((user) => user.id);
    return this.callApiToUnassign(resourceId, userIds);
  }

  unassignSelected(resourceId: number): Observable<any> {
    const userIds = this.selectedAssignedUsersSubject$.getValue().map((user) => user.id);
    return this.callApiToUnassign(resourceId, userIds);
  }

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
    this.clearSelectedAssignedUsers();
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

  /**
   * Gets users available to assign to a resource
   * @param resourceId id of a resource which has no association with users
   * @param filterValue filter to be applied on users
   */
  getUsersToAssign(resourceId: number, filterValue: string): Observable<PaginatedResource<User>> {
    const pageSize = 50;
    return this.userApi
      .getUsersNotInGroup(resourceId, new RequestedPagination(0, pageSize, 'familyName', 'asc'), [
        new UserFilter(filterValue),
      ])
      .pipe(tap({ error: (err) => this.errorHandler.emit(err, 'Fetching users') }));
  }

  /**
   * Get groups available to import (assign its users to a resource)
   * @param filterValue filter to be applied on groups
   */
  getGroupsToImport(filterValue: string): Observable<PaginatedResource<Group>> {
    const pageSize = 50;
    return this.api
      .getAll(new RequestedPagination(0, pageSize, 'name', 'asc'), [new GroupFilter(filterValue)])
      .pipe(tap({ error: (err) => this.errorHandler.emit(err, 'Fetching groups') }));
  }

  private initSubject() {
    return new PaginatedResource([], new SentinelPagination(0, 0, this.context.config.defaultPaginationSize, 0, 0));
  }

  private callApiToAssign(resourceId: number, userIds: number[], groupIds: number[]) {
    return this.api.addUsersToGroup(resourceId, userIds, groupIds).pipe(
      tap(
        (_) => {
          this.clearSelectedUsersToAssign();
          this.clearSelectedGroupsToImport();
        },
        (err) => this.errorHandler.emit(err, 'Adding users')
      ),
      switchMap((_) => this.getAssigned(resourceId, this.lastAssignedPagination, this.lastAssignedFilter))
    );
  }

  private callApiToUnassign(resourceId: number, userIds: number[]) {
    return this.api.removeUsersFromGroup(resourceId, userIds).pipe(
      tap(
        (_) => this.clearSelectedAssignedUsers(),
        (err) => this.errorHandler.emit(err, 'Removing users')
      ),
      switchMap((_) => this.getAssigned(resourceId, this.lastAssignedPagination, this.lastAssignedFilter))
    );
  }
}
