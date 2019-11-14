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

@Component({
  selector: 'kypo2-user-overview',
  templateUrl: './kypo2-user-overview.component.html',
  styleUrls: ['./kypo2-user-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2UserOverviewComponent extends BaseComponent implements OnInit {

  users$: Observable<Kypo2Table<User>>;
  usersHasError$: Observable<boolean>;
  usersTotalLength$: Observable<number>;

  selectedUserIds: number[] = [];

  constructor(public dialog: MatDialog,
              private configService: ConfigService,
              private userService: Kypo2UserOverviewService) {
    super();
  }

  ngOnInit() {
    this.initTable();
  }

  fetchData(event?: LoadTableEvent) {
    this.selectedUserIds = [];
    this.userService.getAll(event.pagination, event.filter)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  onTableEvent(event: TableActionEvent<User>) {
    if (event.action.label.toLocaleLowerCase() === 'delete') {
      this.deleteUser(event.element.id);
    }
  }

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
      new RequestedPagination(0, this.configService.config.defaultPaginationSize, '', ''));
    this.users$ = this.userService.users$
      .pipe(
        map(groups => UserTableCreator.create(groups))
      );
    this.usersHasError$ = this.userService.hasError$;
    this.usersTotalLength$ = this.userService.totalLength$;
    this.fetchData(initialLoadEvent);
  }
}
