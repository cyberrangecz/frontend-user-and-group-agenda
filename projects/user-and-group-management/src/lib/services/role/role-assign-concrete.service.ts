import {Kypo2RoleAssignService} from './kypo2-role-assign.service';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {User, UserRole} from 'kypo2-auth';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {KypoFilter, KypoPagination, KypoRequestedPagination} from 'kypo-common';
import {KypoPaginatedResource} from 'kypo-common';
import {RoleFilter} from '../../model/filters/role-filter';
import {RoleApi} from '../api/role/role-api.service';
import {GroupApi} from '../api/group/group-api.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get roles assigned to a resource and roles available to assign and perform assignment modifications.
 */
@Injectable()
export class RoleAssignConcreteService extends Kypo2RoleAssignService {

  private assignedRolesSubject$: BehaviorSubject<KypoPaginatedResource<UserRole>> = new BehaviorSubject(this.initSubject());
  /**
   * Subscribe to receive assigned roles
   */
  assignedRoles$: Observable<KypoPaginatedResource<UserRole>> = this.assignedRolesSubject$.asObservable();

  private lastPagination: KypoRequestedPagination;
  private lastFilter: string;

  constructor(private api: GroupApi,
              private roleApi: RoleApi,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  /**
   * Assigns (associates) roles with a resource, updates related observables or handles error
   * @param resourceId id of a resource to be associated with selected roles
   * @param roles roles to be assigned to a resource
   */
  assign(resourceId: number, roles: UserRole[]): Observable<any> {
    const roleIds = roles.map(role => role.id);
    return this.callApiToAssign(resourceId, roleIds);
  }

  assignSelected(resourceId: number): Observable<any> {
    const roleIds = this.selectedRolesToAssignSubject$.getValue().map(role => role.id);
    return this.callApiToAssign(resourceId, roleIds);
  }

  /**
   * Gets roles assigned to a resource, updates related observables or handles error
   * @param resourceId id of a resource associated with requested roles
   * @param pagination requested pagination
   * @param filterValue filter to be applied on result
   */
  getAssigned(resourceId: number, pagination: KypoRequestedPagination, filterValue: string = null): Observable<KypoPaginatedResource<UserRole>> {
    this.lastPagination = pagination;
    this.lastFilter = filterValue;
    const filter = new KypoFilter('name', filterValue);
    this.clearSelectedAssignedRoles();
    this.hasErrorSubject$.next(false);
    this.isLoadingAssignedSubject$.next(true);
    return this.api.getRolesOfGroup(resourceId, pagination, [filter])
      .pipe(
        tap(
          roles => {
          this.assignedRolesSubject$.next(roles);
          this.isLoadingAssignedSubject$.next(false);
        },
          err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching roles of group'));
            this.isLoadingAssignedSubject$.next(false);
            this.hasErrorSubject$.next(true);
          })
      );
  }

  /**
   * Gets roles available to assign
   * @param filterValue filter to be applied on roles
   */
  getAvailableToAssign(filterValue: string = null): Observable<KypoPaginatedResource<UserRole>> {
    const filter = filterValue ? [new RoleFilter(filterValue)] : [];
    const paginationSize = 25;
    const pagination = new KypoRequestedPagination(0, paginationSize, 'roleType', 'asc');
    return this.roleApi.getAll(pagination, filter)
      .pipe(
        tap({error: err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching roles'))}),
      );
  }

  /**
   * Unassigns (cancels association) roles from a resource
   * @param resourceId id of a resource which associations should be cancelled
   * @param roles roles to be unassigned from a resource
   */
  unassign(resourceId: number, roles: UserRole[]): Observable<any> {
    const roleIds = roles.map(role => role.id);
    return this.callApiToUnassign(resourceId, roleIds);
  }

  unassignSelected(resourceId): Observable<any> {
    const roleIds = this.selectedAssignedRolesSubject$.getValue().map(role => role.id);
    return this.callApiToUnassign(resourceId, roleIds);
  }

  private callApiToAssign(resourceId: number, roleIds: number[]) {
    this.clearSelectedRolesToAssign();
    return forkJoin(
      roleIds.map(id => this.api.assignRole(resourceId, id)),
    ).pipe(
      catchError(error => of('failed')),
      tap( (results: any[]) => {
        const failedRequests = results.filter(result => result === 'failed');
        if (failedRequests.length > 1) {
          this.errorHandler.emit(new Kypo2UserAndGroupError(undefined, 'Assigning some roles failed'));
        }
      }),
      switchMap(_ => this.getAssigned(resourceId, this.lastPagination, this.lastFilter))
    );
  }

  private callApiToUnassign(resourceId: number, roleIds: number[]) {
    this.clearSelectedAssignedRoles();
    return forkJoin(
      roleIds.map(id => this.api.removeRole(resourceId, id)),
    ).pipe(
      catchError(error => of('failed')),
      tap( (results: any[]) => {
        const failedRequests = results.filter(result => result === 'failed');
        if (failedRequests.length > 1) {
          this.errorHandler.emit(new Kypo2UserAndGroupError(undefined, 'Assigning some roles failed'));
        }
      }),
      switchMap(_ => this.getAssigned(resourceId, this.lastPagination, this.lastFilter))
    );
  }

  private initSubject(): KypoPaginatedResource<UserRole> {
    return new KypoPaginatedResource(
      [],
      new KypoPagination(0, 0, 10, 0, 0)
    );
  }
}
