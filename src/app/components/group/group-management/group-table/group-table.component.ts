import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {merge, of, Subscription} from 'rxjs';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {GroupManagementService} from '../../../../services/group/group-management.service';
import {GroupFacadeService} from '../../../../services/group/group-facade.service';
import {AlertService} from '../../../../services/alert/alert.service';
import {Group} from '../../../../model/group/group.model';
import {Alert} from '../../../../model/alert/alert.model';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {environment} from '../../../../../environments/environment';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {PaginationFactory} from '../../../../model/other/pagination-factory';
import {TableDataWrapper} from '../../../../model/table-data/table-data-wrapper';
import {GroupEditComponent} from '../../group-edit/group-edit.component';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {GroupTableDataModel} from '../../../../model/table-data/group-table-data.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupTableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'select',
    'name',
    'description',
    'rolesCount',
    'membersCount',
    'source',
    'add',
    'edit',
    'delete'
  ];
  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;
  selectedGroupsCount: number;
  totalGroupsCount: number;
  expandedRow: GroupTableDataModel;
  dataChangeSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<GroupTableDataModel>;
  selection = new SelectionModel<GroupTableDataModel>(true, []);

  constructor(public dialog: MatDialog,
              private groupManagementService: GroupManagementService,
              private groupFacade: GroupFacadeService,
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

  selectChange(event: MatCheckboxChange, group: Group) {
    if (event.checked) {
      this.selectGroup(group);
    } else {
      this.unselectGroup(group);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  addUsersToGroup(group: Group) {
    this.openAddUsersToGroupPopup(group);
  }

  editGroup(group: Group) {
    this.openEditGroupPopup(group);
  }

  deleteGroup(group: Group) {
    this.groupFacade.deleteGroup(group.id)
      .subscribe(
        resp => {
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'Group was successfully deleted'));
          this.fetchData();
        },
        err => this.alertService.addAlert(new Alert(AlertType.ERROR, 'Group was not deleted'), {error: err}));
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
          return this.groupFacade.getGroups(
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
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Loading groups'));
          return of([]);
        }))
      .subscribe((data: TableDataWrapper<GroupTableDataModel[]>) => this.createDataSource(data));
  }

  /**
   * Creates table data source from fetched data
   * @param dataWrapper Groups fetched from server
   */
  private createDataSource(dataWrapper: TableDataWrapper<GroupTableDataModel[]>) {
    this.totalGroupsCount = dataWrapper.tableData ? dataWrapper.tableData.length : 0;
    this.selectedGroupsCount = 0;
    this.dataSource = new MatTableDataSource(dataWrapper.tableData);
    this.dataSource.filterPredicate =
      (data: GroupTableDataModel, filter: string) =>
        data.group.name.toLowerCase().indexOf(filter) !== -1;
  }

  private unselectAll() {
    this.selectedGroupsCount = 0;
    this.selection.clear();
    this.groupManagementService.unselectAllGroups();
  }

  private selectAll() {
    this.selectedGroupsCount = this.totalGroupsCount;
    const groups = [];
    this.dataSource.data.forEach(row => {
      this.selection.select(row);
      groups.push(row.group);
    });
    this.groupManagementService.selectGroups(groups);
  }

  private selectGroup(group: Group) {
    this.selectedGroupsCount++;
    this.groupManagementService.selectGroup(group);
  }
  private unselectGroup(group: Group) {
    this.selectedGroupsCount--;
    this.groupManagementService.unselectGroup(group);
  }

  private openEditGroupPopup(group: Group) {
    this.dialog.open(GroupEditComponent, { data: group })
      .afterClosed()
      .subscribe(result => {
        if (result && result === DialogResultEnum.SUCCESS) {
          this.fetchData();
        }
      });
  }

  private subscribeForEvents() {
    this.groupManagementService.dataChange$
      .subscribe(change => this.fetchData());
  }

  private openAddUsersToGroupPopup(group: Group) {

  }
}
