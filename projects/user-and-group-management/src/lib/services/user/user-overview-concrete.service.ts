import {Kypo2UserOverviewService} from './kypo2-user-overview.service';
import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {KypoPaginatedResource} from 'kypo-common';
import {User} from 'kypo2-auth';
import {KypoRequestedPagination} from 'kypo-common';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {ConfigService} from '../../config/config.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {UserApi} from '../api/user/user-api.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/kypo2-user-and-group-notification-type.enum';
import {UserFilter} from '../../model/filters/user-filter';
import {MatDialog} from '@angular/material/dialog';
import {CsirtMuConfirmationDialogComponent, CsirtMuConfirmationDialogConfig, CsirtMuDialogResultEnum} from 'csirt-mu-common';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get users perform operations to modify them.
 */

@Injectable()
export class UserOverviewConcreteService extends Kypo2UserOverviewService {
  private lastPagination: KypoRequestedPagination;
  private lastFilter: string;

  constructor(private userFacade: UserApi,
              private dialog: MatDialog,
              private alertService: Kypo2UserAndGroupNotificationService,
              private configService: ConfigService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super(configService.config.defaultPaginationSize);
  }

  /**
   * Gets all users with passed pagination and filters and updates related observables or handles an error
   * @param pagination requested pagination
   * @param filterValue filter to be applied on resources
   */
  getAll(pagination?: KypoRequestedPagination, filterValue: string = null): Observable<KypoPaginatedResource<User>> {
    this.lastPagination = pagination;
    this.lastFilter = filterValue;
    const filters = filterValue ? [new UserFilter(filterValue)] : [];
    this.hasErrorSubject$.next(false);
    this.clearSelection();
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
   * Deletes user, informs about the result and refreshes list of users or handles error
   * @param user user to be deleted
   */
  delete(user: User): Observable<any> {
    return this.displayConfirmationDialog([user])
      .pipe(
        switchMap(result => result ? this.callApiToDelete([user]) : EMPTY)
      );
  }

  deleteSelected(): Observable<any> {
    const users = this.selectedSubject$.getValue();
    return this.displayConfirmationDialog(users)
      .pipe(
        switchMap(result => result ? this.callApiToDelete(users) : EMPTY)
      );  }



  private displayConfirmationDialog(users: User[]): Observable<boolean> {
    const multipleUsers = users.length > 1;
    const title = multipleUsers ? 'Delete Users' : 'Delete User';
    const content = multipleUsers
      ? `Do you want to delete ${users.length} selected users?`
      : `Do you want to delete selected user?`;
    const dialogData = new CsirtMuConfirmationDialogConfig(
      title,
      content,
      'Cancel',
      'Delete'
    );

    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed()
      .pipe(
        map(result => result === CsirtMuDialogResultEnum.CONFIRMED),
      );
  }

  private callApiToDelete(users: User[]): Observable<any> {
    const ids = users.map(user => user.id);
    return this.userFacade.deleteMultiple(ids)
      .pipe(
        tap(_ => {
          this.clearSelection();
          this.alertService.notify(
            new Kypo2UserAndGroupNotification(
              Kypo2UserAndGroupNotificationType.SUCCESS,
              'Selected users were deleted'));
          },
          err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting user'));
            this.hasErrorSubject$.next(true);
          }),
        switchMap(_ => this.getAll(this.lastPagination, this.lastFilter))
      );
  }
}
