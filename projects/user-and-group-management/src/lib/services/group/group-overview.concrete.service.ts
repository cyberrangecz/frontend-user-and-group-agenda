import { Injectable } from '@angular/core';
import {GroupOverviewService} from './group-overview.service';
import {KypoPaginatedResource, KypoRequestedPagination} from 'kypo-common';
import {EMPTY, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {GroupFilter} from '../../model/filters/group-filter';
import {Group} from '../../model/group/group.model';
import {UserAndGroupContext} from '../shared/user-and-group-context.service';
import {MatDialog} from '@angular/material/dialog';
import {CsirtMuConfirmationDialogComponent, CsirtMuConfirmationDialogConfig, CsirtMuDialogResultEnum} from 'csirt-mu-common';
import {GroupApi} from '../api/group/group-api.service';
import {UserAndGroupNotificationService} from '../client/user-and-group-notification.service';
import {UserAndGroupErrorHandler} from '../client/user-and-group-error-handler.service';
import {UserAndGroupNavigator} from '../client/user-and-group-navigator.service';
import {Router} from '@angular/router';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get groups and perform operations on them.
 */

@Injectable()
export class GroupOverviewConcreteService extends GroupOverviewService {

  private lastPagination: KypoRequestedPagination;
  private lastFilter: string;

  constructor(private api: GroupApi,
              private alertService: UserAndGroupNotificationService,
              private dialog: MatDialog,
              private router: Router,
              private configService: UserAndGroupContext,
              private navigator: UserAndGroupNavigator,
              private errorHandler: UserAndGroupErrorHandler) {
    super(configService.config.defaultPaginationSize);
  }

  /**
   * Gets all groups with requested pagination and filters, updates related observables or handles an error
   * @param pagination requested pagination
   * @param filter filter to be applied on groups
   */
  getAll(pagination: KypoRequestedPagination, filter: string = null): Observable<KypoPaginatedResource<Group>> {
    this.lastPagination = pagination;
    this.lastFilter = filter;
    this.clearSelection();
    const filters = filter ? [new GroupFilter(filter)] : [];
    this.hasErrorSubject$.next(false);
    return this.api.getAll(pagination, filters)
      .pipe(
        tap(groups => {
          this.resourceSubject$.next(groups);
        },
            err => {
          this.errorHandler.emit(err, 'Fetching groups');
          this.hasErrorSubject$.next(true);
        })
    );
  }

  /**
   * Deletes selected groups, updates related observables or handles error
   * @param group a group to delete
   */
  delete(group: Group): Observable<any> {
    return this.displayConfirmationDialog([group])
      .pipe(
        switchMap(result => result ? this.callApiToDelete([group]) : EMPTY)
      );
  }

  deleteSelected(): Observable<any> {
    const groups = this.selectedSubject$.getValue();
    return this.displayConfirmationDialog(groups)
      .pipe(
        switchMap(result => result ? this.callApiToDelete(groups) : EMPTY)
      );
  }

  edit(group: Group): Observable<any> {
    this.router.navigate([this.navigator.toGroupEdit(group.id)]);
    return of(true);
  }

  create(): Observable<any> {
    this.router.navigate([this.navigator.toNewGroup()]);
    return of(true);
  }

  private displayConfirmationDialog(groups: Group[]): Observable<boolean> {
    const multipleGroups = groups.length > 1;
    const title = multipleGroups ? 'Remove Groups' : 'Remove Group';
    const message = multipleGroups
      ? `Do you want to remove ${groups.length} selected groups?`
      : `Do you want to remove selected group?`;
    const dialogData = new CsirtMuConfirmationDialogConfig(title, message, 'Cancel', 'Delete');
    const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed()
      .pipe(
        map(result => result === CsirtMuDialogResultEnum.CONFIRMED),
      );
  }

  private callApiToDelete(groups: Group[]): Observable<any> {
    const ids = groups.map(group => group.id);
    return this.api.deleteMultiple(ids)
      .pipe(
        tap( resp => {
            this.clearSelection();
            this.alertService.emit('success', 'Groups were deleted');
          },
          err => {
            this.errorHandler.emit(err, 'Deleting groups');
            this.hasErrorSubject$.next(true);
          }),
        switchMap(_ => this.getAll(this.lastPagination, this.lastFilter))
      );
  }
}
