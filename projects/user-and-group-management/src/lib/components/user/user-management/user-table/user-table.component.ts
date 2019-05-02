import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource, SortDirection} from '@angular/material';
import {UserTableDataModel} from '../../../../model/table-data/user-table-data.model';
import {UserSelectionService} from '../../../../services/user/user-selection.service';
import {UserFacadeService} from '../../../../services/user/user-facade.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {merge, Observable, of, Subscription} from 'rxjs';
import {TableDataWrapper} from '../../../../model/table-data/table-data-wrapper';
import {AlertService} from '../../../../services/alert/alert.service';
import {PaginationFactory} from '../../../../model/other/pagination-factory';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {Alert} from '../../../../model/alert/alert.model';
import {User} from '../../../../model/user/user.model';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {ConfirmationDialogInputModel} from '../../../shared/confirmation-dialog/confirmation-dialog-input.model';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {ConfigService} from '../../../../config/config.service';
import {UserRolesDialogComponent} from './user-roles-dialog/user-roles-dialog.component';

@Component({
  selector: 'kypo2-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'select',
    'name',
    'login',
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<UserTableDataModel>;
  selection = new SelectionModel<UserTableDataModel>(true, []);

  constructor(
    public dialog: MatDialog,
    private userSelectionService: UserSelectionService,
    private configService: ConfigService,
    private userFacade: UserFacadeService,
    private alertService: AlertService) { }

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
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
          return this.userFacade.getUsersTableData(
            PaginationFactory.createWithSort(this.paginator.pageIndex,
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
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Error while loading users'));
          return of([]);
        }))
      .subscribe((data: TableDataWrapper<UserTableDataModel[]>) => this.createDataSource(data));
  }

  /**
   * Creates table data source from fetched data
   * @param dataWrapper Users fetched from server
   */
  private createDataSource(dataWrapper: TableDataWrapper<UserTableDataModel[]>) {
    this.totalUsersCount = dataWrapper.pagination.totalElements;
    this.selection.clear();
    this.markCheckboxes(this.findPreselectedUsers(dataWrapper.tableData));
    this.dataSource = new MatTableDataSource(dataWrapper.tableData);
    this.dataSource.filterPredicate =
      (data: UserTableDataModel, filter: string) =>
        (data.user.name && data.user.name.toLowerCase().indexOf(filter) !== -1)
        || (data.user.login && data.user.login.toLowerCase().indexOf(filter) !== -1)
        || (data.user.mail && data.user.mail.toLocaleLowerCase().indexOf(filter) !== -1);
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
    const dialogData = new ConfirmationDialogInputModel();
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
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'User was successfully deleted'));
          this.fetchData();
        },
        err => this.alertService.addAlert(new Alert(AlertType.ERROR, 'User was not deleted'), {error: err}));
  }

  private findPreselectedUsers(userTableData: UserTableDataModel[]) {
    return userTableData.filter(userDatum => this.isInSelection(userDatum.user));
  }
  private markCheckboxes(userTableData: UserTableDataModel[]) {
    this.selection.select(...userTableData);
  }

}
