import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {User} from '../../../../model/user/user.model';
import {Set} from 'typescript-collections';
import {MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {merge, Observable, of} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {PaginationFactory} from '../../../../model/other/pagination-factory';
import {UserFacadeService} from '../../../../services/user/user-facade.service';
import {AlertService} from '../../../../services/alert/alert.service';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {Alert} from '../../../../model/alert/alert.model';
import {TableDataWrapper} from '../../../../model/table-data/table-data-wrapper';
import {Group} from '../../../../model/group/group.model';
import {ConfigService} from '../../../../config/config.service';

@Component({
  selector: 'kypo2-add-to-group-user-table',
  templateUrl: './add-to-group-user-table.component.html',
  styleUrls: ['./add-to-group-user-table.component.css']
})
export class AddToGroupUserTableComponent implements OnInit, OnChanges {

  @Input() group: Group;
  @Output() userSelectionChange: EventEmitter<User[]> = new EventEmitter();

  selectedUsers: Set<User> = new Set<User>(user => user.login);
  displayedColumns: string[] = ['select', 'name', 'login', 'email'];
  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;
  selectedUsersCount = 0;
  totalUsersCount: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);

  constructor(private userFacade: UserFacadeService,
              private configService: ConfigService,
              private alertService: AlertService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ('group' in changes) {
      this.initTableDataSource();
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

  fetchData() {
    this.isInErrorState = false;
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.sendRequestToLoadUsers();
        }),
      map(data => {
        this.isLoadingResults = false;
        this.resultsLength = data.pagination.totalElements;
        return data;
      }),
      catchError((err) => {
        this.isLoadingResults = false;
        this.isInErrorState = true;
        this.alertService.addAlert(new Alert(AlertType.ERROR, 'Loading users'), err);
        return of([]);
      }))
      .subscribe((data: TableDataWrapper<User[]>) => this.createDataSource(data));
  }

  /**
   * Creates table data source from fetched data
   * @param dataWrapper Users fetched from server
   */
  private createDataSource(dataWrapper: TableDataWrapper<User[]>) {
    this.totalUsersCount = dataWrapper.tableData.length;
    this.selectedUsersCount = 0;
    this.dataSource = new MatTableDataSource(dataWrapper.tableData);
    this.dataSource.filterPredicate =
      (data: User, filter: string) =>
      data.login.toLowerCase().indexOf(filter) !== -1
      || (data.name && data.name.toLowerCase().indexOf(filter) !== -1);
  }

  /**
   * Creates table data source from training definitions retrieved from a server. Only training definitions where
   * active user is listed as an author are shown
   */
  private initTableDataSource() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator.pageSize = this.configService.config.defaultPaginationSize;
    this.sort.active = 'login';
    this.sort.direction = 'desc';
    this.fetchData();
  }

  private unselectAll() {
    this.selectedUsersCount = 0;
    this.selection.clear();
    this.selectedUsers.clear();
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private selectAll() {
    this.selectedUsersCount = this.totalUsersCount;
    this.dataSource.data.forEach(row => {
      this.selection.select(row);
      this.selectedUsers.add(row);
    });
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private selectUser(user: User) {
    this.selectedUsersCount++;
    this.selectedUsers.add(user);
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private unselectUser(user: User) {
    this.selectedUsersCount--;
    this.selectedUsers.remove(user);
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private sendRequestToLoadUsers(): Observable<TableDataWrapper<User[]>> {
    const pagination = PaginationFactory.createWithSort(this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction);
    if (this.group) {
      return this.userFacade.getUsersNotInGroup(this.group.id, pagination);
    } else {
      return this.userFacade.getUsers(pagination);
    }
  }
}
