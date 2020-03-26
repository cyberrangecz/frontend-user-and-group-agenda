import { Injectable } from '@angular/core';
import {Kypo2GroupOverviewService} from './kypo2-group-overview.service';
import {KypoPaginatedResource, KypoRequestedPagination} from 'kypo-common';
import {EMPTY, Observable, of} from 'rxjs';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/kypo2-user-and-group-notification-type.enum';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {GroupFilter} from '../../model/filters/group-filter';
import {Group} from '../../model/group/group.model';
import {ConfigService} from '../../config/config.service';
import {Kypo2UserAndGroupRouteEvent} from '../../model/events/kypo2-user-and-group-route-event';
import {Kypo2UserAndGroupRoutingEventService} from '../routing/kypo2-user-and-group-routing-event.service';
import {MatDialog} from '@angular/material/dialog';
import {CsirtMuConfirmationDialogComponent, CsirtMuConfirmationDialogConfig, CsirtMuDialogResultEnum} from 'csirt-mu-common';
import {GroupApi} from '../api/group/group-api.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get groups and perform operations on them.
 */

@Injectable()
export class GroupOverviewConcreteService extends Kypo2GroupOverviewService {

  private lastPagination: KypoRequestedPagination;
  private lastFilter: string;

  constructor(private api: GroupApi,
              private alertService: Kypo2UserAndGroupNotificationService,
              private dialog: MatDialog,
              private configService: ConfigService,
              private routingEventService: Kypo2UserAndGroupRoutingEventService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
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
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching groups'));
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
    const route: Kypo2UserAndGroupRouteEvent = {
      actionType: 'EDIT',
      resourceType: 'GROUP',
      resourceId: group.id
    };
    this.routingEventService.navigate(route);
    return of(true);
  }

  create(): Observable<any> {
    const route: Kypo2UserAndGroupRouteEvent = {
      actionType: 'NEW',
      resourceType: 'GROUP'
    };
    this.routingEventService.navigate(route);
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
            this.alertService.notify(
              new Kypo2UserAndGroupNotification(
                Kypo2UserAndGroupNotificationType.SUCCESS,
                'Groups were deleted'));
          },
          err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting groups'));
            this.hasErrorSubject$.next(true);
          }),
        switchMap(_ => this.getAll(this.lastPagination, this.lastFilter))
      );
  }
}
