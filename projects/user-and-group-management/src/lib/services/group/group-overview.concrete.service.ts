import { Injectable } from '@angular/core';
import {GroupOverviewService} from '../shared/group-overview.service';
import {TableAdapter} from '../../model/table-adapters/table-adapter';
import {BehaviorSubject, Observable} from 'rxjs';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/alert-type.enum';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {GroupFacadeService} from '../facade/group/group-facade.service';
import {GroupSelectionService} from '../facade/group/group-selection.service';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {Pagination, RequestedPagination} from 'kypo2-table';
import {tap} from 'rxjs/operators';
import {environment} from '../../../../../../src/environments/environment';
import {GroupTableRow} from '../../model/table-adapters/group-table-row';
import {GroupFilter} from '../../model/utils/group-filter';

@Injectable()
export class GroupOverviewConcreteService extends GroupOverviewService {

  private groupsSubject: BehaviorSubject<TableAdapter<GroupTableRow[]>> = new BehaviorSubject(this.initSubject());
  groups$: Observable<TableAdapter<GroupTableRow[]>> = this.groupsSubject.asObservable();

  constructor(private groupFacade: GroupFacadeService,
              private groupManagementService: GroupSelectionService,
              private alertService: Kypo2UserAndGroupNotificationService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
    super();
  }

  getAll(pagination?: RequestedPagination, filter?: string) {
    this.hasErrorSubject$.next(false);
    return this.groupFacade.getGroupsTable(pagination, GroupFilter.create(filter)).pipe(
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

  delete(id: number): Observable<any> {
    this.hasErrorSubject$.next(false);
    return this.groupFacade.deleteGroup(id).pipe(
      tap( resp => {
        this.groupManagementService.emitDataChange();
        this.alertService.notify(
          new Kypo2UserAndGroupNotification(
            Kypo2UserAndGroupNotificationType.SUCCESS,
            'Selected group was successfully deleted'));
        },
        err => {
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting group'));
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }

  deleteGroups(ids: number[]): Observable<any> {
    this.hasErrorSubject$.next(false);
    return this.groupFacade.deleteGroups(ids).pipe(
      tap(resp => {
          this.groupManagementService.emitDataChange();
          this.alertService.notify(
            new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS,
              'Selected groups were successfully deleted'));
        },
        err => {
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting groups'));
          this.hasErrorSubject$.next(true);
        }
      )
    );
  }

  private initSubject(): TableAdapter<GroupTableRow[]> {
    return new TableAdapter([], new Pagination(0, 0, environment.defaultPaginationSize, 0, 0));
  }
}
