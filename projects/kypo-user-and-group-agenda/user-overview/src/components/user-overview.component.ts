import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SentinelBaseDirective, OffsetPaginationEvent } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { User } from '@muni-kypo-crp/user-and-group-model';
import { SentinelTable, TableLoadEvent, TableActionEvent } from '@sentinel/components/table';
import { defer, Observable, of } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { UserTable } from '../model/user-table';
import { PaginationService, DeleteControlItem } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { UserOverviewService } from '../services/overview/user-overview.service';
import { UserAndGroupNavigator } from '@muni-kypo-crp/user-and-group-agenda';

/**
 * Main smart component of user overview page
 */
@Component({
  selector: 'kypo-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOverviewComponent extends SentinelBaseDirective implements OnInit {
  readonly INIT_SORT_NAME = 'familyName';
  readonly INIT_SORT_DIR = 'asc';

  /**
   * Data for users table
   */
  users$: Observable<SentinelTable<User>>;
  /**
   * True, if data requested for table has error, false otherwise
   */
  usersHasError$: Observable<boolean>;

  controls: SentinelControlItem[];

  constructor(
    private userService: UserOverviewService,
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
    this.users$ = this.userService.resource$.pipe(
      map((groups) => new UserTable(groups, this.userService, this.navigator))
    );
    this.usersHasError$ = this.userService.hasError$;
    this.onLoadEvent(initialLoadEvent);
    this.userService.selected$.pipe(takeWhile(() => this.isAlive)).subscribe((ids) => this.initControls(ids.length));
  }

  /**
   * Clears selected users and calls service to get new data for table component
   * @param event load table vent emitted by table component
   */
  onLoadEvent(event: TableLoadEvent): void {
    this.paginationService.setPagination(event.pagination.size);
    this.userService
      .getAll(event.pagination, event.filter)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action and call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<User>): void {
    event.action.result$.pipe(take(1)).subscribe();
  }

  onControlsAction(controlItem: SentinelControlItem): void {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Changes internal state of the component, stores ids of users selected in table component
   * @param selected users selected in table component
   */
  onUserSelected(selected: User[]): void {
    this.userService.setSelection(selected);
  }

  private initControls(selectedUsersLength: number) {
    this.controls = [
      new DeleteControlItem(
        selectedUsersLength,
        defer(() => this.userService.deleteSelected())
      ),
      new SentinelControlItem(
        'download_oidc_users',
        'Get Local OIDC Users',
        'primary',
        of(false),
        defer(() => this.userService.getLocalOIDCUsers())
      ),
    ];
  }
}
