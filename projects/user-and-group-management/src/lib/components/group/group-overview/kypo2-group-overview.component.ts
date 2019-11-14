import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Kypo2Table, LoadTableEvent, RequestedPagination, TableActionEvent} from 'kypo2-table';
import {GroupTableRowAdapter} from '../../../model/table-adapters/group-table-row-adapter';
import {Kypo2GroupOverviewService} from '../../../services/group/kypo2-group-overview.service';
import {map, takeWhile} from 'rxjs/operators';
import {BaseComponent} from '../../../model/base-component';
import {GroupTableCreator} from '../../../model/table-adapters/group-table-creator';
import {Kypo2UserAndGroupRoutingEventService} from '../../../services/routing/kypo2-user-and-group-routing-event.service';
import {Kypo2UserAndGroupRouteEvent} from '../../../model/events/kypo2-user-and-group-route-event';
import {ConfigService} from '../../../config/config.service';

@Component({
  selector: 'kypo2-group-management',
  templateUrl: './kypo2-group-overview.component.html',
  styleUrls: ['./kypo2-group-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2GroupOverviewComponent extends BaseComponent implements OnInit {

  groups$: Observable<Kypo2Table<GroupTableRowAdapter>>;
  groupsHasError$: Observable<boolean>;
  groupsTotalLength$: Observable<number>;

  selectedGroupIds: number[] = [];

  constructor(private groupService: Kypo2GroupOverviewService,
              private configService: ConfigService,
              private kypo2UserAndGroupRoutingEventService: Kypo2UserAndGroupRoutingEventService,) {
    super();
  }

  ngOnInit() {
    this.initTable();
  }

  fetchData(event?: LoadTableEvent) {
    this.selectedGroupIds = [];
    this.groupService.getAll(event.pagination, event.filter)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  onTableEvent(event: TableActionEvent<GroupTableRowAdapter>) {
    if (event.action.label.toLocaleLowerCase() === 'delete') {
      this.deleteGroup(event.element.groupId);
    } else if (event.action.label.toLocaleLowerCase() === 'edit') {
      const route: Kypo2UserAndGroupRouteEvent = {
        actionType: 'EDIT',
        resourceType: 'GROUP',
        resourceId: event.element.groupId
      };
      this.kypo2UserAndGroupRoutingEventService.navigate(route);
    }
  }

  onGroupSelected(selected: GroupTableRowAdapter[]) {
    this.selectedGroupIds = selected.map(groupRow => groupRow.groupId);
  }

  deleteSelectedGroups() {
    this.groupService.delete(this.selectedGroupIds)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  createGroup() {
    const route: Kypo2UserAndGroupRouteEvent = {
      actionType: 'NEW',
      resourceType: 'GROUP'
    };
    this.kypo2UserAndGroupRoutingEventService.navigate(route);
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.configService.config.defaultPaginationSize, '', ''));
    this.groups$ = this.groupService.groups$
      .pipe(
        map(groups => GroupTableCreator.create(groups))
      );
    this.groupsHasError$ = this.groupService.hasError$;
    this.groupsTotalLength$ = this.groupService.totalLength$;
    this.fetchData(initialLoadEvent);
  }

  private deleteGroup(id: number) {
    this.groupService.delete([id])
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }
}
