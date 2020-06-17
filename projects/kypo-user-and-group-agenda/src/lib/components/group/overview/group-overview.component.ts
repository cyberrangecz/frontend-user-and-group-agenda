import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KypoBaseComponent, KypoRequestedPagination } from 'kypo-common';
import { KypoControlItem } from 'kypo-controls';
import { Group } from 'kypo-user-and-group-model';
import { Kypo2Table, LoadTableEvent, TableActionEvent } from 'kypo2-table';
import { defer, Observable, of } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { GroupTable } from '../../../model/adapters/table/group/group-table';
import { DeleteControlItem } from '../../../model/controls/delete-control-item';
import { SaveControlItem } from '../../../model/controls/save-control-item';
import { GroupOverviewService } from '../../../services/group/overview/group-overview.service';
import { UserAndGroupContext } from '../../../services/shared/user-and-group-context.service';

/**
 * Main smart component of group overview page
 */
@Component({
  selector: 'kypo-group-overview',
  templateUrl: './group-overview.component.html',
  styleUrls: ['./group-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupOverviewComponent extends KypoBaseComponent implements OnInit {
  readonly INIT_SORT_NAME = 'name';
  readonly INIT_SORT_DIR = 'asc';

  /**
   * Data for groups table component
   */
  groups$: Observable<Kypo2Table<Group>>;

  /**
   * True if error was thrown while getting data for groups table, false otherwise
   */
  groupsHasError$: Observable<boolean>;

  controls: KypoControlItem[];

  constructor(private groupService: GroupOverviewService, private configService: UserAndGroupContext) {
    super();
  }

  ngOnInit() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new KypoRequestedPagination(
        0,
        this.configService.config.defaultPaginationSize,
        this.INIT_SORT_NAME,
        this.INIT_SORT_DIR
      )
    );
    this.groups$ = this.groupService.resource$.pipe(map((groups) => new GroupTable(groups, this.groupService)));
    this.groupsHasError$ = this.groupService.hasError$;
    this.groupService.selected$.pipe(takeWhile((_) => this.isAlive)).subscribe((ids) => this.initControls(ids.length));
    this.onLoadTableEvent(initialLoadEvent);
  }

  onControlsAction(controlItem: KypoControlItem) {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Clears selected groups and calls service to get new data for groups table
   * @param event event emitted from table component
   */
  onLoadTableEvent(event: LoadTableEvent) {
    this.groupService
      .getAll(event.pagination, event.filter)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<Group>) {
    event.action.result$.pipe(take(1)).subscribe();
  }

  /**
   * Changes internal state of the component when selection is changed in table component
   * @param selected groups selected in table component
   */
  onGroupSelected(selected: Group[]) {
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
