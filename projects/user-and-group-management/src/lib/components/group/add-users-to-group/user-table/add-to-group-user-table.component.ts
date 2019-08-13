import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Set} from 'typescript-collections';
import {MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {merge, Observable, of} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {PaginationFactory} from '../../../../model/other/pagination-factory';
import {UserFacadeService} from '../../../../services/user/user-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/alert/kypo2-user-and-group-notification.service';
import {TableAdapter} from '../../../../model/table-data/table-adapter';
import {Group} from '../../../../model/group/group.model';
import {ConfigService} from '../../../../config/config.service';
import {ErrorHandlerService} from '../../../../services/alert/error-handler.service';
import {User} from 'kypo2-auth';
import {StringNormalizer} from '../../../../model/utils/string-normalizer';
import {UserTableRow} from '../../../../model/table-data/user-table-row';

@Component({
  selector: 'kypo2-add-to-group-user-table',
  templateUrl: './add-to-group-user-table.component.html',
  styleUrls: ['./add-to-group-user-table.component.css']
})
export class AddToGroupUserTableComponent implements OnInit, OnChanges {

  @Input() group: Group;
  @Output() userSelectionChange: EventEmitter<User[]> = new EventEmitter();

  selectedUsers: Set<User> = new Set<User>(user => user.login);
  displayedColumns: string[] = ['select', 'name', 'login', 'issuer'];
  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;
  selectedUsersCount = 0;
  totalUsersCount: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: MatTableDataSource<UserTableRow>;
  selection = new SelectionModel<User>(true, []);

  constructor(private userFacade: UserFacadeService,
              private configService: ConfigService,
              private alertService: Kypo2UserAndGroupNotificationService,
              private errorHandler: ErrorHandlerService) { }

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
    this.dataSource.filter = StringNormalizer.normalizeDiacritics(filterValue.trim().toLowerCase());
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
        this.errorHandler.displayInAlert(err, 'Loading users');
        return of([]);
      }))
      .subscribe((data: TableAdapter<UserTableRow[]>) => this.createDataSource(data));
  }

  /**
   * Creates table data source from fetched data
   * @param tableAdapter Users fetched from server
   */
  private createDataSource(tableAdapter: TableAdapter<UserTableRow[]>) {
    this.totalUsersCount = tableAdapter.pagination.totalElements;
    this.selection.clear();
    this.markCheckboxes(this.findPreselectedUsers(tableAdapter.content.map(row => row.user)));
    this.dataSource = new MatTableDataSource(tableAdapter.content);
    this.dataSource.filterPredicate =
      (row: UserTableRow, filter: string) =>
      row.normalizedLogin.indexOf(filter) !== -1
      || row.normalizedName.indexOf(filter) !== -1;
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
    this.selection.selected.forEach(user => {
      this.selectedUsers.remove(user);
    });
    this.selection.clear();
    this.selectedUsersCount = this.selectedUsers.size();
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private selectAll() {
    this.dataSource.data.forEach(row => {
      this.selectedUsers.add(row.user);
      this.selection.select(row.user);
    });
    this.selectedUsersCount = this.selectedUsers.size();
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private selectUser(user: User) {
    this.selectedUsers.add(user);
    this.selectedUsersCount = this.selectedUsers.size();
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private unselectUser(user: User) {
    this.selectedUsers.remove(user);
    this.selectedUsersCount = this.selectedUsers.size();
    this.userSelectionChange.emit(this.selectedUsers.toArray());
  }

  private sendRequestToLoadUsers(): Observable<TableAdapter<UserTableRow[]>> {
    const pagination = PaginationFactory.createWithSort(this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction);
    if (this.group) {
      return this.userFacade.getUsersNotInGroup(this.group.id, pagination);
    } else {
      return this.userFacade.getUsersTable(pagination);
    }
  }

  private isInSelection(userToCheck: User): boolean {
    return this.selectedUsers.toArray()
      .map(user => user.login)
      .includes(userToCheck.login);
  }

  private findPreselectedUsers(users: User[]): User[] {
    return users.filter(user => this.isInSelection(user));
  }
  private markCheckboxes(users: User[]) {
    this.selection.select(...users);
  }
}
