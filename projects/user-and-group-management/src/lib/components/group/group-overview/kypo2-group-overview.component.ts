import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {defer, Observable, of} from 'rxjs';
import {Kypo2Table, LoadTableEvent, TableActionEvent} from 'kypo2-table';
import {GroupTableRowAdapter} from '../../../model/table/group/group-table-row-adapter';
import {Kypo2GroupOverviewService} from '../../../services/group/kypo2-group-overview.service';
import {map, take, takeWhile} from 'rxjs/operators';
import {KypoBaseComponent, KypoRequestedPagination} from 'kypo-common';
import {GroupTable} from '../../../model/table/group/group-table';
import {ConfigService} from '../../../config/config.service';
import {KypoControlItem} from 'kypo-controls';
import {DeleteControlItem} from '../../../model/controls/delete-control-item';
import {SaveControlItem} from '../../../model/controls/save-control-item';

/**
 * Main smart component of group overview page
 */
@Component({
  selector: 'kypo2-group-management',
  templateUrl: './kypo2-group-overview.component.html',
  styleUrls: ['./kypo2-group-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2GroupOverviewComponent extends KypoBaseComponent implements OnInit {

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

  controls: KypoControlItem[];

  constructor(private groupService: Kypo2GroupOverviewService,
              private configService: ConfigService) {
    super();
  }

  ngOnInit() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new KypoRequestedPagination(0, this.configService.config.defaultPaginationSize, this.INIT_SORT_NAME, this.INIT_SORT_DIR));
    this.groups$ = this.groupService.resource$
      .pipe(
        map(groups => new GroupTable(groups, this.groupService))
      );
    this.groupsHasError$ = this.groupService.hasError$;
    this.groupService.selected$
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(ids => this.initControls(ids.length));
    this.onLoadTable(initialLoadEvent);
  }

  onControlsAction(controlItem: KypoControlItem) {
    controlItem.result$
      .pipe(
        take(1)
      ).subscribe();
  }

  /**
   * Clears selected groups and calls service to get new data for groups table
   * @param event event emitted from table component
   */
  onLoadTable(event: LoadTableEvent) {
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
    event.action.result$
      .pipe(
        take(1)
      ).subscribe();
  }

  /**
   * Changes internal state of the component when selection is changed in table component
   * @param selected groups selected in table component
   */
  onGroupSelected(selected: GroupTableRowAdapter[]) {
    this.groupService.setSelection(selected.map(adapter => adapter.group));
  }

  private initControls(selectedLength: number) {
    this.controls = [
      new DeleteControlItem(selectedLength,
        defer(() => this.groupService.deleteSelected())),
      new SaveControlItem(
        'Create',
        of(false),
        defer(() => this.groupService.create())
      )
    ];
  }
}
