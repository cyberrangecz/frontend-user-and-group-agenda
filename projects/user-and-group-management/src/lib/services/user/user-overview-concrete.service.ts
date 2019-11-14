import {UserOverviewService} from './user-overview.service';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {User} from 'kypo2-auth';
import {RequestedPagination} from '../../model/other/requested-pagination';
import {Pagination} from 'kypo2-table';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {ConfigService} from '../../config/config.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {UserFacadeService} from '../facade/user/user-facade.service';
import {GroupFilter} from '../../model/filters/group-filter';
import {switchMap, tap} from 'rxjs/operators';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/alert-type.enum';

@Injectable()
export class UserOverviewConcreteService extends UserOverviewService {
  private lastPagination: RequestedPagination;
  private lastFilter: string;

  private usersSubject$: BehaviorSubject<PaginatedResource<User[]>> = new BehaviorSubject(this.initSubject());
  users$: Observable<PaginatedResource<User[]>> = this.usersSubject$.asObservable();

  constructor(private userFacade: UserFacadeService,
              private alertService: Kypo2UserAndGroupNotificationService,
              private configService: ConfigService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  getAll(pagination?: RequestedPagination, filterValue: string = null): Observable<PaginatedResource<User[]>> {
    this.lastPagination = pagination;
    this.lastFilter = filterValue;
    const filters = filterValue ? [new GroupFilter(filterValue)] : [];
    this.hasErrorSubject$.next(false);
    return this.userFacade.getUsers(pagination, filters)
      .pipe(
        tap(users => {
            this.usersSubject$.next(users);
            this.totalLengthSubject.next(users.pagination.totalElements);
          },
          err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching users'));
            this.hasErrorSubject$.next(true);
          })
      );
  }

  delete(ids: number[]): Observable<any> {
    return this.userFacade.deleteUsers(ids)
      .pipe(
        tap(resp => {
          this.alertService.notify(
            new Kypo2UserAndGroupNotification(
              Kypo2UserAndGroupNotificationType.SUCCESS,
              'Selected users was successfully deleted'));
        },
          err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting user'));
            this.hasErrorSubject$.next(true);
          }),
        switchMap(_ => this.getAll(this.lastPagination, this.lastFilter))
      );
  }

  private initSubject(): PaginatedResource<User[]> {
    return new PaginatedResource([], new Pagination(0, 0, this.configService.config.defaultPaginationSize, 0, 0));  }
}
