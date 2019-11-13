import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {UserTableRow} from '../../../../model/table-adapters/user-table-row';
import {UserSelectionService} from '../../../../services/facade/user/user-selection.service';
import {UserFacadeService} from '../../../../services/facade/user/user-facade.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {merge, Observable, of, Subscription} from 'rxjs';
import {PaginatedResource} from '../../../../model/table-adapters/paginated-resource';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupNotificationType} from '../../../../model/enums/alert-type.enum';
import {Kypo2UserAndGroupNotification} from '../../../../model/events/kypo2-user-and-group-notification';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {ConfirmationDialogInput} from '../../../shared/confirmation-dialog/confirmation-dialog.input';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {ConfigService} from '../../../../config/config.service';
import {UserRolesDialogComponent} from './user-roles-dialog/user-roles-dialog.component';
import {Kypo2UserAndGroupErrorService} from '../../../../services/notification/kypo2-user-and-group-error.service';
import {User} from 'kypo2-auth';
import {Kypo2UserAndGroupError} from '../../../../model/events/kypo2-user-and-group-error';
import {RequestedPagination} from '../../../../model/other/requested-pagination';

@Component({
  selector: 'kypo2-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'login',
    'issuer',
    'email',
    'roles',
    'delete'
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;
  selectedUsersCount = 0;
  totalUsersCount: number;
  dataChangeSubscription: Subscription;
  selectionChangeSubscription: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<UserTableRow>;
  selection = new SelectionModel<UserTableRow>(true, []);

  constructor(
    public dialog: MatDialog,
    private userSelectionService: UserSelectionService,
    private configService: ConfigService,
    private userFacade: UserFacadeService,
    private errorHandler: Kypo2UserAndGroupErrorService,
    private alertService: Kypo2UserAndGroupNotificationService) { }

  ngOnInit() {
    this.subscribeForEvents();
    this.initTableDataSource();
  }

  ngOnDestroy() {
    if (this.dataChangeSubscription) {
      this.dataChangeSubscription.unsubscribe();
    }
    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
  }

  /**
   * Applies filter data source
   * @param filterValue value by which the data should be filtered. Inserted by user
   */
  applyFilter(filterValue: string) {

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  selectAllChange() {
    if (this.isAllSelected()) {
      this.unselectAll();
    } else {
      this.selectAll();
    }
  }

  selectChange(event: MatCheckboxChange, user: User) {
    if (event.checked) {
      this.selectUser(user);
    } else {
      this.unselectUser(user);
    }
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  removeUser(user: User) {
    this.userConfirmedRemovingUser(user)
      .subscribe(confirmed => {
        if (confirmed) {
          this.sendRequestToRemoveUser(user);
        }
      });
  }

  showUserRoles(user: User) {
    this.dialog.open(UserRolesDialogComponent, {
      data: {
        user: user
      }
    });
  }

  /**
   * Creates table data source from training definitions retrieved from a server. Only training definitions where
   * active user is listed as an author are shown
   */
  private initTableDataSource() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator.pageSize = this.configService.config.defaultPaginationSize;
    this.sort.active = 'fullName';
    this.fetchData();
  }

  /**
   * Fetches data from the server and maps them to table data objects
   */
  fetchData() {
    this.isInErrorState = false;
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userFacade.getUsersTable(
            new RequestedPagination(this.paginator.pageIndex,
              this.paginator.pageSize,
              this.sort.active,
              this.sort.direction));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.pagination.totalElements;
          return data;
        }),
        catchError((err) => {
          this.isLoadingResults = false;
          this.isInErrorState = true;
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Loading users'));
          return of([]);
        }))
      .subscribe((data: PaginatedResource<UserTableRow[]>) => this.createDataSource(data));
  }

  /**
   * Creates table data source from fetched data
   * @param dataWrapper Users fetched from server
   */
  private createDataSource(dataWrapper: PaginatedResource<UserTableRow[]>) {
    this.totalUsersCount = dataWrapper.pagination.totalElements;
    this.selection.clear();
    this.markCheckboxes(this.findPreselectedUsers(dataWrapper.elements));
    this.dataSource = new MatTableDataSource(dataWrapper.elements);
  }

  private unselectAll() {
    this.selection.selected.forEach(tableData =>
      this.userSelectionService.unselectUser(tableData.user));
    this.selection.clear();
  }

  private selectAll() {
    this.dataSource.data.forEach(row => {
      this.selection.select(row);
      this.userSelectionService.selectUser(row.user);
    });
  }

  private selectUser(user: User) {
    this.userSelectionService.selectUser(user);
  }

  private unselectUser(user: User) {
    this.userSelectionService.unselectUser(user);
  }

  private isInSelection(userToCheck: User): boolean {
    return this.userSelectionService.getSelectedUsers()
      .map(user => user.login)
      .includes(userToCheck.login);
  }

  private subscribeForEvents() {
    this.dataChangeSubscription = this.userSelectionService.dataChange$
      .subscribe(change => this.fetchData());

    this.selectionChangeSubscription =  this.userSelectionService.selectionChange$
      .subscribe(usersCount =>
      this.selectedUsersCount = usersCount);
  }

  private userConfirmedRemovingUser(userToRemove: User): Observable<boolean> {
    const dialogData = new ConfirmationDialogInput();
    dialogData.title = 'Remove user';
    dialogData.content = `Do you want to remove ${userToRemove.name} from database?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed()
      .pipe(map(result => result === DialogResultEnum.SUCCESS));
  }

  private sendRequestToRemoveUser(user: User) {
    this.userFacade.removeUser(user.id)
      .subscribe(
        resp => {
          this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS, 'User was successfully deleted'));
          this.fetchData();
        },
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting user'))
      );
  }

  private findPreselectedUsers(userTableData: UserTableRow[]) {
    return userTableData.filter(userDatum => this.isInSelection(userDatum.user));
  }
  private markCheckboxes(userTableData: UserTableRow[]) {
    this.selection.select(...userTableData);
  }

}
