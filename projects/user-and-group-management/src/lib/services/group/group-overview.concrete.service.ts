import { Injectable } from '@angular/core';
import {Kypo2GroupOverviewService} from './kypo2-group-overview.service';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {BehaviorSubject, Observable} from 'rxjs';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/kypo2-user-and-group-notification-type.enum';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {GroupApi} from '../api/group/group-api.service';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {Pagination, RequestedPagination} from 'kypo2-table';
import {switchMap, tap} from 'rxjs/operators';
import {GroupFilter} from '../../model/filters/group-filter';
import {Group} from '../../model/group/group.model';
import {ConfigService} from '../../config/config.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get groups and perform operations on them.
 */

@Injectable()
export class GroupOverviewConcreteService extends Kypo2GroupOverviewService {

  private lastPagination: RequestedPagination;
  private lastFilter: string;

  private groupsSubject$: BehaviorSubject<PaginatedResource<Group[]>> = new BehaviorSubject(this.initSubject());

  /**
   * List of groups with currently selected pagination options
   */
  groups$: Observable<PaginatedResource<Group[]>> = this.groupsSubject$.asObservable();

  constructor(private groupFacade: GroupApi,
              private alertService: Kypo2UserAndGroupNotificationService,
              private configService: ConfigService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  /**
   * Gets all groups with requested pagination and filters, updates related observables or handles an error
   * @param pagination requested pagination
   * @param filter filter to be applied on groups
   */
  getAll(pagination: RequestedPagination, filter: string = null): Observable<PaginatedResource<Group[]>> {
    this.lastPagination = pagination;
    this.lastFilter = filter;
    const filters = filter ? [new GroupFilter(filter)] : [];
    this.hasErrorSubject$.next(false);
    return this.groupFacade.getAll(pagination, filters)
      .pipe(
        tap(groups => {
          this.groupsSubject$.next(groups);
          this.totalLengthSubject.next(groups.pagination.totalElements);
        },
            err => {
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching groups'));
          this.hasErrorSubject$.next(true);
        })
    );
  }

  /**
   * Deletes selected groups, updates related observables or handles error
   * @param ids ids of groups to delete
   */
  delete(ids: number[]): Observable<any> {
    return this.groupFacade.deleteMultiple(ids)
      .pipe(
        tap( resp => {
          this.alertService.notify(
            new Kypo2UserAndGroupNotification(
              Kypo2UserAndGroupNotificationType.SUCCESS,
              'Selected groups was successfully deleted'));
          },
            err => {
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting group'));
          this.hasErrorSubject$.next(true);
        }),
        switchMap(_ => this.getAll(this.lastPagination, this.lastFilter))
      );
  }

  private initSubject(): PaginatedResource<Group[]> {
    return new PaginatedResource([], new Pagination(0, 0, this.configService.config.defaultPaginationSize, 0, 0));
  }
}
