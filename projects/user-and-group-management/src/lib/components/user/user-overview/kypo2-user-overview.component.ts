import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {defer, Observable} from 'rxjs';
import {Kypo2Table, LoadTableEvent, TableActionEvent} from 'kypo2-table';
import {User} from 'kypo2-auth';
import {map, take, takeWhile} from 'rxjs/operators';
import {KypoBaseComponent, KypoRequestedPagination} from 'kypo-common';
import {Kypo2UserOverviewService} from '../../../services/user/kypo2-user-overview.service';
import {ConfigService} from '../../../config/config.service';
import {UserTable} from '../../../model/table/user/user-table';
import {KypoControlItem} from 'kypo-controls';
import {DeleteControlItem} from '../../../model/controls/delete-control-item';

/**
 * Main smart component of user overview page
 */
@Component({
  selector: 'kypo2-user-overview',
  templateUrl: './kypo2-user-overview.component.html',
  styleUrls: ['./kypo2-user-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2UserOverviewComponent extends KypoBaseComponent implements OnInit {

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

  constructor(private configService: ConfigService,
              private userService: Kypo2UserOverviewService) {
    super();
  }

  ngOnInit() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new KypoRequestedPagination(0, this.configService.config.defaultPaginationSize, this.INIT_SORT_NAME, this.INIT_SORT_DIR));
    this.users$ = this.userService.resource$
      .pipe(
        map(groups => new UserTable(groups, this.userService))
      );
    this.usersHasError$ = this.userService.hasError$;
    this.onLoadEvent(initialLoadEvent);
    this.userService.selected$
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(ids => this.initControls(ids.length));
  }

  /**
   * Clears selected users and calls service to get new data for table component
   * @param event load table vent emitted by table component
   */
  onLoadEvent(event: LoadTableEvent) {
    this.userService.getAll(event.pagination, event.filter)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  /**
   * Resolves type of action and call appropriate handler
   * @param event action event emitted by table component
   */
  onTableAction(event: TableActionEvent<User>) {
    event.action.result$
      .pipe(
        take(1)
      ).subscribe();
  }

  onControlsAction(controlItem: KypoControlItem) {
    controlItem.result$
      .pipe(
        take(1)
      ).subscribe();
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
      new DeleteControlItem(selectedUsersLength,
        defer(() => this.userService.deleteSelected()))
    ];
  }
}
