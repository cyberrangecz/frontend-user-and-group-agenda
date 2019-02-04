import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {UserTableDataModel} from '../../../../model/table-data/user-table-data.model';
import {UserManagementService} from '../../../../services/user/user-management.service';
import {UserFacadeService} from '../../../../services/user/user-facade.service';
import {environment} from '../../../../../environments/environment';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {merge, of, Subscription} from 'rxjs';
import {TableDataWrapper} from '../../../../model/table-data/table-data-wrapper';
import {AlertService} from '../../../../services/alert/alert.service';
import {PaginationFactory} from '../../../../model/other/pagination-factory';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {Alert} from '../../../../model/alert/alert.model';
import {User} from '../../../../model/user/user.model';
import {SelectionModel} from '@angular/cdk/collections';
import {UserEditComponent} from '../../user-edit/user-edit.component';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'select',
    'name',
    'login',
    'email',
    'admin',
    'roles',
    'groups',
    'source',
    'edit',
    'delete'
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;
  selectedUsersCount: number;
  totalUsersCount: number;
  dataChangeSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<UserTableDataModel>;
  selection = new SelectionModel<UserTableDataModel>(true, []);
  adminSelection = new SelectionModel<UserTableDataModel>(true, []);

  constructor(
    public dialog: MatDialog,
    private userManagementService: UserManagementService,
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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
     return this.selection.selected.length === this.dataSource.data.length;
  }

  changeIsAdmin(event: MatCheckboxChange, user: User) {
    // TODO REST API CALL?
  }

  editUser(user: User) {
    this.openEditUserPopup(user);
  }

  deleteUser(user: User) {
    this.userFacade.deleteUser(user.id)
      .subscribe(
        resp => {
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'User was successfully deleted'));
          this.fetchData();
        },
        err => this.alertService.addAlert(new Alert(AlertType.ERROR, 'User was not deleted'), {error: err}));
  }

  /**
   * Creates table data source from training definitions retrieved from a server. Only training definitions where
   * active user is listed as an author are shown
   */
  private initTableDataSource() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator.pageSize = environment.defaultPaginationSize;
    this.sort.active = 'name';
    this.sort.direction = 'desc';
    this.fetchData();
  }

  /**
   * Fetches data from the server and maps them to table data objects
   */
  private fetchData() {
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
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Loading users'));
          return of([]);
        }))
      .subscribe((data: TableDataWrapper<UserTableDataModel[]>) => this.createDataSource(data));
  }

  /**
   * Creates table data source from fetched data
   * @param dataWrapper Users fetched from server
   */
  private createDataSource(dataWrapper: TableDataWrapper<UserTableDataModel[]>) {
    this.totalUsersCount = dataWrapper.tableData ? dataWrapper.tableData.length : 0;
    this.selectedUsersCount = 0;
    this.dataSource = new MatTableDataSource(dataWrapper.tableData);
    this.resolvePreSelectedAdminCheckboxes(dataWrapper.tableData);
    this.dataSource.filterPredicate =
      (data: UserTableDataModel, filter: string) =>
        data.user.name.toLowerCase().indexOf(filter) !== -1
        || data.user.login.toLowerCase().indexOf(filter) !== -1
        || data.user.mail.toLocaleLowerCase().indexOf(filter) !== -1;
  }

  private resolvePreSelectedAdminCheckboxes(data: UserTableDataModel[]) {
    this.adminSelection.select(...data.filter(row => row.isAdmin));
  }

  private unselectAll() {
    this.selectedUsersCount = 0;
    this.selection.clear();
    this.userManagementService.unselectAllUsers();
  }

  private selectAll() {
    this.selectedUsersCount = this.totalUsersCount;
    const users = [];
    this.dataSource.data.forEach(row => {
      this.selection.select(row);
      users.push(row.user);
    });
    this.userManagementService.selectUsers(users);
  }

  private selectUser(user: User) {
    this.selectedUsersCount++;
    this.userManagementService.selectUser(user);
  }

  private unselectUser(user: User) {
    this.selectedUsersCount--;
    this.userManagementService.unselectUser(user);
  }

  private openEditUserPopup(user: User) {
    this.dialog.open(UserEditComponent, { data: user })
      .afterClosed()
      .subscribe(result => {
        if (result && result === DialogResultEnum.SUCCESS) {
          this.fetchData();
        }
      });
  }

  private subscribeForEvents() {
    this.userManagementService.dataChange$
      .subscribe(change => this.fetchData());
  }
}
