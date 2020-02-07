import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Kypo2Table, LoadTableEvent, RequestedPagination, TableActionEvent} from 'kypo2-table';
import {User} from 'kypo2-auth';
import {map, switchMap, takeWhile} from 'rxjs/operators';
import {BaseComponent} from '../../../model/base-component';
import {Kypo2UserOverviewService} from '../../../services/user/kypo2-user-overview.service';
import {ConfirmationDialogInput} from '../../shared/confirmation-dialog/confirmation-dialog.input';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';
import {ConfigService} from '../../../config/config.service';
import {UserTableCreator} from '../../../model/table-adapters/user-table-creator';

/**
 * Main smart component of user overview page
 */
@Component({
  selector: 'kypo2-user-overview',
  templateUrl: './kypo2-user-overview.component.html',
  styleUrls: ['./kypo2-user-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2UserOverviewComponent extends BaseComponent implements OnInit {

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
  /**
   * Total length of table elements
   */
  usersTotalLength$: Observable<number>;

  /**
   * Ids of users selected in table
   */
  selectedUserIds: number[] = [];

  constructor(public dialog: MatDialog,
              private configService: ConfigService,
              private userService: Kypo2UserOverviewService) {
    super();
  }

  ngOnInit() {
    this.initTable();
  }

  /**
   * Clears selected users and calls service to get new data for table component
   * @param event load table vent emitted by table component
   */
  onLoadEvent(event: LoadTableEvent) {
    this.selectedUserIds = [];
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
    if (event.action.id === UserTableCreator.DELETE_ACTION_ID) {
      this.deleteUser(event.element.id);
    }
  }

  /***
   * Displays confirmation dialog, if confirmed, calls service to delete selected users
   */
  deleteSelectedUsers() {
    const dialogData = new ConfirmationDialogInput();
    dialogData.title = 'Remove selected users';
    dialogData.content = `Do you want to remove ${this.selectedUserIds.length} selected users from database?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });
    dialogRef.afterClosed()
      .pipe(
        takeWhile(_ => this.isAlive),
        map(result => result === DialogResultEnum.SUCCESS),
        switchMap(confirmed => confirmed ? this.userService.delete(this.selectedUserIds) : of(null))
      ).subscribe();
  }

  /**
   * Changes internal state of the component, stores ids of users selected in table component
   * @param selected users selected in table component
   */
  onUserSelected(selected: User[]) {
    this.selectedUserIds = selected.map(user => user.id);
  }

  private deleteUser(id: number) {
    const dialogData = new ConfirmationDialogInput();
    dialogData.title = 'Remove user';
    dialogData.content = `Do you want to remove selected user from database?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });
    dialogRef.afterClosed()
      .pipe(
        takeWhile(_ => this.isAlive),
        map(result => result === DialogResultEnum.SUCCESS),
        switchMap(confirmed => confirmed ? this.userService.delete([id]) : of(null))
      ).subscribe();
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.configService.config.defaultPaginationSize, this.INIT_SORT_NAME, this.INIT_SORT_DIR));
    this.users$ = this.userService.users$
      .pipe(
        map(groups => UserTableCreator.create(groups))
      );
    this.usersHasError$ = this.userService.hasError$;
    this.usersTotalLength$ = this.userService.totalLength$;
    this.onLoadEvent(initialLoadEvent);
  }
}
