import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { OffsetPaginationEvent } from '@sentinel/common/pagination';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Group } from '@muni-kypo-crp/user-and-group-model';
import { SentinelTable, TableLoadEvent, TableActionEvent } from '@sentinel/components/table';
import { defer, Observable, of } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { GroupTable } from '../model/table/group-table';
import { DeleteControlItem, SaveControlItem, PaginationService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { GroupOverviewService } from '../services/group-overview.service';
import { UserAndGroupNavigator } from '@muni-kypo-crp/user-and-group-agenda';

/**
 * Main smart component of group-overview overview page
 */
@Component({
  selector: 'kypo-group-overview',
  templateUrl: './group-overview.component.html',
  styleUrls: ['./group-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupOverviewComponent extends SentinelBaseDirective implements OnInit {
  readonly INIT_SORT_NAME = 'name';
  readonly INIT_SORT_DIR = 'asc';

  /**
   * Data for groups table component
   */
  groups$: Observable<SentinelTable<Group>>;

  /**
   * True if error was thrown while getting data for groups table, false otherwise
   */
  groupsHasError$: Observable<boolean>;

  controls: SentinelControlItem[];

  constructor(
    private groupService: GroupOverviewService,
    private paginationService: PaginationService,
    private navigator: UserAndGroupNavigator
  ) {
    super();
  }

  ngOnInit(): void {
    const initialLoadEvent: TableLoadEvent = {
      pagination: new OffsetPaginationEvent(
        0,
        this.paginationService.getPagination(),
        this.INIT_SORT_NAME,
        this.INIT_SORT_DIR
      ),
    };
    this.groups$ = this.groupService.resource$.pipe(
      map((groups) => new GroupTable(groups, this.groupService, this.navigator))
    );
    this.groupsHasError$ = this.groupService.hasError$;
    this.groupService.selected$.pipe(takeWhile(() => this.isAlive)).subscribe((ids) => this.initControls(ids.length));
    this.onTableLoadEvent(initialLoadEvent);
  }

  onControlsAction(controlItem: SentinelControlItem): void {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Clears selected groups and calls service to get new data for groups table
   * @param event event emitted from table component
   */
  onTableLoadEvent(event: TableLoadEvent): void {
    this.paginationService.setPagination(event.pagination.size);
    this.groupService
      .getAll(event.pagination, event.filter)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<Group>): void {
    event.action.result$.pipe(take(1)).subscribe();
  }

  /**
   * Changes internal state of the component when selection is changed in table component
   * @param selected groups selected in table component
   */
  onGroupSelected(selected: Group[]): void {
    this.groupService.setSelection(selected);
  }

  private initControls(selectedLength: number) {
    this.controls = [
      new DeleteControlItem(
        selectedLength,
        defer(() => this.groupService.deleteSelected())
      ),
      new SaveControlItem(
        'Create',
        of(false),
        defer(() => this.groupService.create())
      ),
    ];
  }
}
