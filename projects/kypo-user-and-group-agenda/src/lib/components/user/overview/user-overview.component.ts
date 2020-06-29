import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { KypoBaseDirective, KypoRequestedPagination } from 'kypo-common';
import { KypoControlItem } from 'kypo-controls';
import { User } from 'kypo-user-and-group-model';
import { Kypo2Table, LoadTableEvent, TableActionEvent } from 'kypo2-table';
import { defer, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { UserTable } from '../../../model/adapters/table/user/user-table';
import { DeleteControlItem } from '../../../model/controls/delete-control-item';
import { UserAndGroupContext } from '../../../services/shared/user-and-group-context.service';
import { UserOverviewService } from '../../../services/user/overview/user-overview.service';

/**
 * Main smart component of user overview page
 */
@Component({
  selector: 'kypo-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOverviewComponent extends KypoBaseDirective implements OnInit {
  readonly INIT_SORT_NAME = 'familyName';
  readonly INIT_SORT_DIR = 'asc';

  /**
   * Data for users table
   */
  users$: Observable<Kypo2Table<User>>;
  /**
   * True, if data requested for table has error, false otherwise
   */
  usersHasError$: Observable<boolean>;

  controls: KypoControlItem[];

  constructor(private configService: UserAndGroupContext, private userService: UserOverviewService) {
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
    this.users$ = this.userService.resource$.pipe(map((groups) => new UserTable(groups, this.userService)));
    this.usersHasError$ = this.userService.hasError$;
    this.onLoadEvent(initialLoadEvent);
    this.userService.selected$.pipe(takeWhile((_) => this.isAlive)).subscribe((ids) => this.initControls(ids.length));
  }

  /**
   * Clears selected users and calls service to get new data for table component
   * @param event load table vent emitted by table component
   */
  onLoadEvent(event: LoadTableEvent) {
    this.userService
      .getAll(event.pagination, event.filter)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action and call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<User>) {
    event.action.result$.pipe(take(1)).subscribe();
  }

  onControlsAction(controlItem: KypoControlItem) {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Changes internal state of the component, stores ids of users selected in table component
   * @param selected users selected in table component
   */
  onUserSelected(selected: User[]) {
    this.userService.setSelection(selected);
  }

  private initControls(selectedUsersLength: number) {
    this.controls = [
      new DeleteControlItem(
        selectedUsersLength,
        defer(() => this.userService.deleteSelected())
      ),
    ];
  }
}
