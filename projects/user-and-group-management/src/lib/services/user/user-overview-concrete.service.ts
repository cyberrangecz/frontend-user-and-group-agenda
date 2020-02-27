import {Kypo2UserOverviewService} from './kypo2-user-overview.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {User} from 'kypo2-auth';
import {RequestedPagination} from '../../model/other/requested-pagination';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {ConfigService} from '../../config/config.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {UserApi} from '../api/user/user-api.service';
import {switchMap, tap} from 'rxjs/operators';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/kypo2-user-and-group-notification-type.enum';
import {UserFilter} from '../../model/filters/user-filter';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get users perform operations to modify them.
 */

@Injectable()
export class UserOverviewConcreteService extends Kypo2UserOverviewService {
  private lastPagination: RequestedPagination;
  private lastFilter: string;

  constructor(private userFacade: UserApi,
              private alertService: Kypo2UserAndGroupNotificationService,
              private configService: ConfigService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  /**
   * Gets all users with passed pagination and filters and updates related observables or handles an error
   * @param pagination requested pagination
   * @param filterValue filter to be applied on resources
   */
  getAll(pagination?: RequestedPagination, filterValue: string = null): Observable<PaginatedResource<User>> {
    this.lastPagination = pagination;
    this.lastFilter = filterValue;
    const filters = filterValue ? [new UserFilter(filterValue)] : [];
    this.hasErrorSubject$.next(false);
    return this.userFacade.getAll(pagination, filters)
      .pipe(
        tap(users => {
            this.resourceSubject$.next(users);
          },
          err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching users'));
            this.hasErrorSubject$.next(true);
          })
      );
  }

  /**
   * Deletes selected users, informs about the result and refreshes list of users or handles error
   * @param ids ids of users to be deleted
   */
  delete(ids: number[]): Observable<any> {
    return this.userFacade.deleteMultiple(ids)
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

}
