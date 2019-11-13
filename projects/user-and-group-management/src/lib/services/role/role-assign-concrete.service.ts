import {RoleAssignService} from './role-assign.service';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {UserRole} from 'kypo2-auth';
import {GroupFacadeService} from '../facade/group/group-facade.service';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {RoleFacadeService} from '../facade/role/role-facade.service';
import {RequestedPagination} from '../../model/other/requested-pagination';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {RoleFilter} from '../../model/filters/role-filter';

@Injectable()
export class RoleAssignConcreteService extends RoleAssignService {

  private assignedRolesSubject$: BehaviorSubject<UserRole[]> = new BehaviorSubject([]);
  assignedRoles$: Observable<UserRole[]> = this.assignedRolesSubject$.asObservable();

  constructor(private groupFacade: GroupFacadeService,
              private roleFacade: RoleFacadeService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  assign(resourceId: number, roles: UserRole[]): Observable<any> {
    return forkJoin(
      roles.map(role => this.groupFacade.assignRoleToGroup(resourceId, role.id)),
    ).pipe(
      catchError(error => of('failed')),
      tap( (results: any[]) => {
        const failedRequests = results.filter(result => result === 'failed');
        if (failedRequests.length > 1) {
          this.errorHandler.emit(new Kypo2UserAndGroupError(undefined, 'Assigning some roles failed'));
        }
      }),
      switchMap(_ => this.getAssigned(resourceId))
    );
  }

  getAssigned(resourceId: number): Observable<UserRole[]> {
    this.hasErrorSubject$.next(false);
    this.isLoadingAssignedSubject$.next(true);
    return this.groupFacade.getRolesOfGroup(resourceId)
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

  getAvailableToAssign(filterValue: string = null): Observable<PaginatedResource<UserRole[]>> {
    const filter = filterValue ? [new RoleFilter(filterValue)] : [];
    const paginationSize = 25;
    const pagination = new RequestedPagination(0, paginationSize, 'roleType', 'asc');
    return this.roleFacade.getRoles(pagination, filter)
      .pipe(
        tap({error: err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching roles'))}),
      );
  }

  unassign(resourceId: number, roles: UserRole[]): Observable<any> {
    return forkJoin(
      roles.map(role => this.groupFacade.removeRoleFromGroup(resourceId, role.id)),
    ).pipe(
      catchError(error => of('failed')),
      tap( (results: any[]) => {
        const failedRequests = results.filter(result => result === 'failed');
        if (failedRequests.length > 1) {
          this.errorHandler.emit(new Kypo2UserAndGroupError(undefined, 'Assigning some roles failed'));
        }
      }),
      switchMap(_ => this.getAssigned(resourceId))
    );
  }
}
