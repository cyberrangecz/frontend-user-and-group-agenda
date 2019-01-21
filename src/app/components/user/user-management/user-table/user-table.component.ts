import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {MatPaginator} from '@angular/material/typings/esm5/paginator';
import {UserTableDataModel} from '../../../../model/table-data/user-table-data-model';
import {UserManagementService} from '../../../../services/user/user-management.service';
import {UserFacadeService} from '../../../../services/user/user-facade.service';
import {environment} from '../../../../../environments/environment';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {merge, of} from 'rxjs';
import {TableDataWrapper} from '../../../../model/table-data/table-data-wrapper';
import {AlertService} from '../../../../services/alert/alert.service';
import {PaginationFactory} from '../../../../model/other/pagination-factory';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {Alert} from '../../../../model/alert.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  displayedColumns: string[] = [
    '',
    'name',
    'login',
    'email',
    'admin',
    'roles',
    'groups',
    'source',
    '',
    ''
  ];

  dataSource: MatTableDataSource<UserTableDataModel>;
  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(private userManagementService: UserManagementService,
              private userFacade: UserFacadeService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.initTableDataSource();
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
  fetchData() {
    this.isInErrorState = false;
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userFacade.getUsers(
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
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Loading training definitions'));
          return of([]);
        })
      ).subscribe((data: TableDataWrapper<UserTableDataModel[]>) => this.createDataSource(data));

  }

  /**
   * Creates table data source from fetched data
   * @param tableData Users fetched from server
   */
  private createDataSource(tableData: TableDataWrapper<UserTableDataModel[]>) {
    this.dataSource = new MatTableDataSource(tableData.tableData);
    this.dataSource.filterPredicate =
      (data: UserTableDataModel, filter: string) =>
        data.user.name.toLowerCase().indexOf(filter) !== -1
        || data.user.login.toLowerCase().indexOf(filter) !== -1
        || data.user.mail.toLocaleLowerCase().indexOf(filter) !== -1;
  }
}
