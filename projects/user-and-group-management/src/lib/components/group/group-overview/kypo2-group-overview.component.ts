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

/**
 * Main smart component of group overview page
 */
@Component({
  selector: 'kypo2-group-management',
  templateUrl: './kypo2-group-overview.component.html',
  styleUrls: ['./kypo2-group-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2GroupOverviewComponent extends BaseComponent implements OnInit {

  readonly INIT_SORT_NAME = 'name';
  readonly INIT_SORT_DIR = 'asc';

  /**
   * Data for groups table component
   */
  groups$: Observable<Kypo2Table<GroupTableRowAdapter>>;

  /**
   * True if error was thrown while getting data for groups table, false otherwise
   */
  groupsHasError$: Observable<boolean>;

  /**
   * Count of group total elements
   */
  groupsTotalLength$: Observable<number>;

  /**
   * Ids od groups selected in table compoment
   */
  selectedGroupIds: number[] = [];

  constructor(private groupService: Kypo2GroupOverviewService,
              private configService: ConfigService,
              private kypo2UserAndGroupRoutingEventService: Kypo2UserAndGroupRoutingEventService,) {
    super();
  }

  ngOnInit() {
    this.initTable();
  }

  /**
   * Clears selected groups and calls service to get new data for groups table
   * @param event event emitted from table component
   */
  onLoadTable(event: LoadTableEvent) {
    this.selectedGroupIds = [];
    this.groupService.getAll(event.pagination, event.filter)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  /**
   * Resolves type of action call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<GroupTableRowAdapter>) {
    if (event.action.label === GroupTableCreator.DELETE_ACTION) {
      this.deleteGroup(event.element.groupId);
    } else if (event.action.label === GroupTableCreator.EDIT_ACTION) {
      this.edit(event.element.groupId);
    }
  }

  /**
   * Changes internal state of the component when selection is changed in table component
   * @param selected groups selected in table component
   */
  onGroupSelected(selected: GroupTableRowAdapter[]) {
    this.selectedGroupIds = selected.map(groupRow => groupRow.groupId);
  }

  /**
   * Calls service to delete selected groups
   */
  deleteSelectedGroups() {
    this.groupService.delete(this.selectedGroupIds)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  /**
   * Sends request to navigate to create page
   */
  createGroup() {
    const route: Kypo2UserAndGroupRouteEvent = {
      actionType: 'NEW',
      resourceType: 'GROUP'
    };
    this.kypo2UserAndGroupRoutingEventService.navigate(route);
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.configService.config.defaultPaginationSize, this.INIT_SORT_NAME, this.INIT_SORT_DIR));
    this.groups$ = this.groupService.groups$
      .pipe(
        map(groups => GroupTableCreator.create(groups))
      );
    this.groupsHasError$ = this.groupService.hasError$;
    this.groupsTotalLength$ = this.groupService.totalLength$;
    this.onLoadTable(initialLoadEvent);
  }

  private deleteGroup(id: number) {
    this.groupService.delete([id])
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  private edit(groupId: number) {
    const route: Kypo2UserAndGroupRouteEvent = {
      actionType: 'EDIT',
      resourceType: 'GROUP',
      resourceId: groupId
    };
    this.kypo2UserAndGroupRoutingEventService.navigate(route);
  }
}
