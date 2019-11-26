import {Kypo2UserAssignService} from './kypo2-user-assign.service';
import {User} from 'kypo2-auth';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {BehaviorSubject, Observable} from 'rxjs';
import {GroupFacadeService} from '../facade/group/group-facade.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {RequestedPagination} from '../../model/other/requested-pagination';
import {Group} from '../../model/group/group.model';
import {switchMap, tap} from 'rxjs/operators';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {UserFacadeService} from '../facade/user/user-facade.service';
import {GroupFilter} from '../../model/filters/group-filter';
import {Pagination} from '../../model/table-adapters/pagination';
import {ConfigService} from '../../config/config.service';
import {UserFilter} from '../../model/filters/user-filter';
import {Injectable} from '@angular/core';

@Injectable()
export class UserAssignConcreteService extends Kypo2UserAssignService {

  constructor(private groupFacade: GroupFacadeService,
              private userFacade: UserFacadeService,
              private configService: ConfigService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  private lastAssignedPagination: RequestedPagination;
  private lastAssignedFilter: string;

  private assignedUsersSubject$: BehaviorSubject<PaginatedResource<User[]>> = new BehaviorSubject(this.initSubject());
  assignedUsers$: Observable<PaginatedResource<User[]>> = this.assignedUsersSubject$.asObservable();


  assign(resourceId: number, users: User[], groups: Group[] = []): Observable<any> {
   return this.groupFacade.addUsersToGroup(resourceId,
      users.map(user => user.id),
      groups.map(group => group.id))
      .pipe(
        tap({error: err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Adding users'))}),
        switchMap(_ => this.getAssigned(resourceId, this.lastAssignedPagination, this.lastAssignedFilter))
      );
  }

  unassign(resourceId: number, users: User[]): Observable<any> {
    return this.groupFacade.removeUsersFromGroup(resourceId, users.map(user => user.id))
      .pipe(
        tap({error: err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Removing users'))}),
        switchMap(_ => this.getAssigned(resourceId, this.lastAssignedPagination, this.lastAssignedFilter))
      );
  }

  getAssigned(resourceId: number, pagination: RequestedPagination, filterValue: string = null): Observable<PaginatedResource<User[]>> {
    const filter = filterValue ? [new UserFilter(filterValue)] : [];
    this.lastAssignedPagination = pagination;
    this.lastAssignedFilter = filterValue;
    this.hasErrorSubject$.next(false);
    this.isLoadingAssignedSubject$.next(true);
    return this.userFacade.getUsersInGroups([resourceId], pagination, filter)
      .pipe(
        tap(
          paginatedUsers => {
            this.assignedUsersSubject$.next(paginatedUsers);
            this.isLoadingAssignedSubject$.next(false);
            this.totalLengthSubject.next( paginatedUsers.pagination.totalElements);
          },
          err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching users'));
            this.isLoadingAssignedSubject$.next(false);
            this.hasErrorSubject$.next(true);
          }
        )
      );
  }

  getUsersToAssign(resourceId: number, filterValue: string): Observable<PaginatedResource<User[]>> {
    const pageSize = 50;
    return this.userFacade.getUsersNotInGroup(resourceId,
      new RequestedPagination(0, pageSize, 'familyName', 'asc'),
      [new UserFilter(filterValue)])
      .pipe(
        tap({error: err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching users'))})
      );
  }

  getGroupsToImport(filterValue: string): Observable<PaginatedResource<Group[]>> {
    const pageSize = 50;
    return this.groupFacade.getGroups(
      new RequestedPagination(0, pageSize, 'name', 'asc'),
      [new GroupFilter(filterValue)])
      .pipe(
        tap({error: err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching groups'))})
      );
  }

  private initSubject() {
    return new PaginatedResource([],
      new Pagination(0,
        0,
        this.configService.config.defaultPaginationSize,
        0,
        0));
  }
}
