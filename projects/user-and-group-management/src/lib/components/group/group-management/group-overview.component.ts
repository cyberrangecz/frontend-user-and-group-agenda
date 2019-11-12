import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Kypo2Table, LoadTableEvent, RequestedPagination, TableActionEvent} from 'kypo2-table';
import {GroupTableRowAdapter} from '../../../model/table-adapters/group-table-row-adapter';
import {GroupOverviewService} from '../../../services/shared/group-overview.service';
import {environment} from '../../../../../../../src/environments/environment';
import {ActivatedRoute} from '@angular/router';
import {map, takeWhile} from 'rxjs/operators';
import {BaseComponent} from '../../../model/base-component';
import {GroupTableCreator} from '../../../model/table-adapters/group-table-creator';
import {Kypo2UserAndGroupRoutingEventService} from '../../../services/routing/kypo2-user-and-group-routing-event.service';
import {Kypo2UserAndGroupRouteEvent} from '../../../model/events/kypo2-user-and-group-route-event';

@Component({
  selector: 'kypo2-group-management',
  templateUrl: './group-overview.component.html',
  styleUrls: ['./group-overview.component.css']
})
export class GroupOverviewComponent extends BaseComponent implements OnInit {

  groups$: Observable<Kypo2Table<GroupTableRowAdapter>>;
  groupsTableHasError$: Observable<boolean>;
  groupTableTotalLength$: Observable<number>;

  selectedGroups: number[] = [];

  constructor(private groupOverviewService: GroupOverviewService,
              private kypo2UserAndGroupRoutingEventService: Kypo2UserAndGroupRoutingEventService,
              private activeRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.initTable();
  }

  fetchData(event?: LoadTableEvent) {
    this.groupOverviewService.getAll(event.pagination, event.filter)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  tableEvent(event: TableActionEvent<GroupTableRowAdapter>) {
    if (event.action.label.toLocaleLowerCase() === 'delete group') {
      this.deleteSelectedGroup(event.element.group.id);
    } else if (event.action.label.toLocaleLowerCase() === 'edit group') {
      const route: Kypo2UserAndGroupRouteEvent = {
        actionType: 'NEW',
        resourceType: 'GROUP',
        resourceId: event.element.group.id
      };
      this.kypo2UserAndGroupRoutingEventService.navigate(route);
    }
  }

  selectedRows(event: GroupTableRowAdapter[]) {
    this.selectedGroups = [];
    event.forEach( selectedGroup => {
      this.selectedGroups.push(selectedGroup.group.id);
    });
  }

  deleteSelectedGroups() {
    this.groupOverviewService.deleteGroups(this.selectedGroups)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  createGroup() {
    const route: Kypo2UserAndGroupRouteEvent = {
      actionType: 'NEW',
      resourceType: 'GROUP',
      resourceId: ''
    };
    this.kypo2UserAndGroupRoutingEventService.navigate(route);
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, environment.defaultPaginationSize, '', ''));
    this.activeRoute.data
      .pipe(
        takeWhile(_ => this.isAlive),
      ).subscribe(data => {
      this.fetchData(initialLoadEvent);
    });

    this.groups$ = this.groupOverviewService.groups$
      .pipe(
        map(trainingRuns => GroupTableCreator.create(trainingRuns))
      );
    this.groupsTableHasError$ = this.groupOverviewService.hasError$;
    this.groupTableTotalLength$ = this.groupOverviewService.totalLength$;
  }

  private deleteSelectedGroup(id: number) {
    this.groupOverviewService.delete(id)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }
}
