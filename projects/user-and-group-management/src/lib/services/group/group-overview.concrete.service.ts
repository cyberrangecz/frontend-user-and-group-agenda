import { Injectable } from '@angular/core';
import {GroupOverviewService} from '../shared/group-overview.service';
import {PaginatedResource} from '../../model/table-adapters/paginated-resource';
import {BehaviorSubject, Observable} from 'rxjs';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/alert-type.enum';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {GroupFacadeService} from '../facade/group/group-facade.service';
import {GroupSelectionService} from '../facade/group/group-selection.service';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {Pagination, RequestedPagination} from 'kypo2-table';
import {switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../../../../src/environments/environment';
import {GroupFilter} from '../../model/filters/group-filter';
import {Group} from '../../model/group/group.model';

@Injectable()
export class GroupOverviewConcreteService extends GroupOverviewService {

  private lastPagination: RequestedPagination;
  private lastFilter: string;

  private groupsSubject: BehaviorSubject<PaginatedResource<Group[]>> = new BehaviorSubject(this.initSubject());
  groups$: Observable<PaginatedResource<Group[]>> = this.groupsSubject.asObservable();

  constructor(private groupFacade: GroupFacadeService,
              private alertService: Kypo2UserAndGroupNotificationService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  getAll(pagination: RequestedPagination, filter: string = null) {
    this.lastPagination = pagination;
    this.lastFilter = filter;
    const filters = filter ? [new GroupFilter(filter)] : [];
    this.hasErrorSubject$.next(false);
    return this.groupFacade.getGroups(pagination, filters).pipe(
      tap(groups => {
          this.groupsSubject.next(groups);
          this.totalLengthSubject.next(groups.pagination.totalElements);
        },
        err => {
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Fetching groups'));
          this.hasErrorSubject$.next(true);
        })
    );
  }

  delete(ids: number[]): Observable<any> {
    return this.groupFacade.deleteGroups(ids)
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
    return new PaginatedResource([], new Pagination(0, 0, environment.defaultPaginationSize, 0, 0));
  }
}
