import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CsirtMuConfirmationDialogComponent,
  CsirtMuConfirmationDialogConfig,
  CsirtMuDialogResultEnum,
} from 'csirt-mu-common';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoRequestedPagination } from 'kypo-common';
import { UserApi } from 'kypo-user-and-group-api';
import { User } from 'kypo-user-and-group-model';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { UserFilter } from '../../../model/filters/user-filter';
import { UserAndGroupErrorHandler } from '../../client/user-and-group-error-handler.service';
import { UserAndGroupNotificationService } from '../../client/user-and-group-notification.service';
import { UserAndGroupContext } from '../../shared/user-and-group-context.service';
import { UserOverviewService } from './user-overview.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get users perform operations to modify them.
 */

@Injectable()
export class UserOverviewConcreteService extends UserOverviewService {
  private lastPagination: KypoRequestedPagination;
  private lastFilter: string;

  constructor(
    private api: UserApi,
    private dialog: MatDialog,
    private alertService: UserAndGroupNotificationService,
    private configService: UserAndGroupContext,
    private errorHandler: UserAndGroupErrorHandler
  ) {
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
    return this.api.getAll(pagination, filters).pipe(
      tap(
        (users) => {
          this.resourceSubject$.next(users);
        },
        (err) => {
          this.errorHandler.emit(err, 'Fetching users');
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }

  /**
   * Deletes user, informs about the result and refreshes list of users or handles error
   * @param user user to be deleted
   */
  delete(user: User): Observable<any> {
    return this.displayConfirmationDialog([user]).pipe(
      switchMap((result) => (result ? this.callApiToDelete([user]) : EMPTY))
    );
  }

  deleteSelected(): Observable<any> {
    const users = this.selectedSubject$.getValue();
    return this.displayConfirmationDialog(users).pipe(
      switchMap((result) => (result ? this.callApiToDelete(users) : EMPTY))
    );
  }

  private displayConfirmationDialog(users: User[]): Observable<boolean> {
    const multipleUsers = users.length > 1;
    const title = multipleUsers ? 'Delete Users' : 'Delete User';
    const content = multipleUsers
      ? `Do you want to delete ${users.length} selected users?`
      : `Do you want to delete selected user?`;
    const dialogData = new CsirtMuConfirmationDialogConfig(title, content, 'Cancel', 'Delete');

    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed().pipe(map((result) => result === CsirtMuDialogResultEnum.CONFIRMED));
  }

  private callApiToDelete(users: User[]): Observable<any> {
    const ids = users.map((user) => user.id);
    return this.api.deleteMultiple(ids).pipe(
      tap(
        (_) => {
          this.clearSelection();
          this.alertService.emit('success', 'Selected users were deleted');
        },
        (err) => {
          this.errorHandler.emit(err, 'Deleting user');
          this.hasErrorSubject$.next(true);
        }
      ),
      switchMap((_) => this.getAll(this.lastPagination, this.lastFilter))
    );
  }
}
