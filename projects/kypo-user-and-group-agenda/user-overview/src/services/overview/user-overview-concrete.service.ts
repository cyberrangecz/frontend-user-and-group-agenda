import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  SentinelConfirmationDialogComponent,
  SentinelConfirmationDialogConfig,
  SentinelDialogResultEnum,
} from '@sentinel/components/dialogs';
import { RequestedPagination, PaginatedResource } from '@sentinel/common';
import { UserApi } from '@muni-kypo-crp/user-and-group-api';
import { User } from '@muni-kypo-crp/user-and-group-model';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { UserFilter, UserAndGroupContext } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { UserAndGroupErrorHandler, UserAndGroupNotificationService } from '@muni-kypo-crp/user-and-group-agenda';
import { UserOverviewService } from './user-overview.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get users perform operations to modify them.
 */

@Injectable()
export class UserOverviewConcreteService extends UserOverviewService {
  private lastPagination: RequestedPagination;
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
  getAll(pagination?: RequestedPagination, filterValue: string = null): Observable<PaginatedResource<User>> {
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
   * Gets user with given user id
   * @param userId user id
   */
  get(userId: number): Observable<User> {
    this.hasErrorSubject$.next(false);
    return this.api.get(userId).pipe(
      tap(
        (_) => _,
        (err) => {
          this.errorHandler.emit(err, `Fetching user with id: ${userId}`);
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
    const dialogData = new SentinelConfirmationDialogConfig(title, content, 'Cancel', 'Delete');

    const dialogRef = this.dialog.open(SentinelConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed().pipe(map((result) => result === SentinelDialogResultEnum.CONFIRMED));
  }

  private callApiToDelete(users: User[]): Observable<any> {
    const ids = users.map((user) => user.id);
    return this.api.deleteMultiple(ids).pipe(
      tap(
        () => {
          this.clearSelection();
          this.alertService.emit('success', 'Selected users were deleted');
        },
        (err) => {
          this.errorHandler.emit(err, 'Deleting user');
          this.hasErrorSubject$.next(true);
        }
      ),
      switchMap(() => this.getAll(this.lastPagination, this.lastFilter))
    );
  }
}
