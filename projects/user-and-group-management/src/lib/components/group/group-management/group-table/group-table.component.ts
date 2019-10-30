import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {merge, of, Subscription} from 'rxjs';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {GroupSelectionService} from '../../../../services/facade/group/group-selection.service';
import {GroupFacadeService} from '../../../../services/facade/group/group-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/notification/kypo2-user-and-group-notification.service';
import {Group} from '../../../../model/group/group.model';
import {Kypo2UserAndGroupNotification} from '../../../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../../model/enums/alert-type.enum';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {PaginationFactory} from '../../../../model/other/pagination-factory';
import {TableAdapter} from '../../../../model/table-adapters/table-adapter';
import {GroupEditComponent} from '../../group-edit/group-edit.component';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {GroupTableRow} from '../../../../model/table-adapters/group-table-row';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AddUsersToGroupComponent} from '../../add-users-to-group/add-users-to-group.component';
import {AddRolesToGroupComponent} from '../../add-roles-to-group/add-roles-to-group.component';
import {ConfigService} from '../../../../config/config.service';
import {Kypo2UserAndGroupErrorService} from '../../../../services/notification/kypo2-user-and-group-error.service';
import {StringNormalizer} from '../../../../model/utils/string-normalizer';
import {Kypo2UserAndGroupError} from '../../../../model/events/kypo2-user-and-group-error';

@Component({
  selector: 'kypo2-group-table',
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
    'expiration-date',
    'roles-count',
    'members-count',
    'add-roles',
    'add-users',
    'edit',
    'delete'
  ];
  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;
  selectedGroupsCount: number;
  totalGroupsCount: number;
  expandedRow: GroupTableRow;
  dataChangeSubscription: Subscription;
  selectionChangeSubscription: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: MatTableDataSource<GroupTableRow>;
  selection = new SelectionModel<GroupTableRow>(true, []);

  constructor(public dialog: MatDialog,
              private groupSelectionService: GroupSelectionService,
              private configService: ConfigService,
              private groupFacade: GroupFacadeService,
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

  addRolesToGroup(group: Group) {
    this.openAddRolesToGroupPopup(group);
  }

  editGroup(group: Group) {
    this.openEditGroupPopup(group);
  }

  deleteGroup(group: Group) {
    this.groupFacade.deleteGroup(group.id)
      .subscribe(
        resp => {
          this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS, 'Group was successfully deleted'));
          this.fetchData();
        },
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting group'))
      );
  }

  /**
   * Creates table data source from training definitions retrieved from a server. Only training definitions where
   * active user is listed as an author are shown
   */
  private initTableDataSource() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator.pageSize = this.configService.config.defaultPaginationSize;
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
          return this.groupFacade.getGroupsTable(
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
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Loading groups'));
          return of([]);
        }))
      .subscribe((data: TableAdapter<GroupTableRow[]>) => this.createDataSource(data));
  }

  /**
   * Creates table data source from fetched data
   * @param dataWrapper Groups fetched from server
   */
  private createDataSource(dataWrapper: TableAdapter<GroupTableRow[]>) {
    this.totalGroupsCount = dataWrapper.pagination.totalElements;
    this.selection.clear();
    this.markCheckboxes(this.findPreselectedGroups(dataWrapper.content));
    this.dataSource = new MatTableDataSource(dataWrapper.content);
    this.dataSource.filterPredicate = (row: GroupTableRow, filter: string) => row.normalizedName.indexOf(filter) !== -1;
  }

  private unselectAll() {
    this.selection.selected.forEach(tableData =>
    this.groupSelectionService.unselectGroup(tableData.group));
    this.selection.clear();
  }

  private selectAll() {
    this.dataSource.data.forEach(row => {
      this.selection.select(row);
      this.groupSelectionService.selectGroup(row.group);
    });
  }

  private selectGroup(group: Group) {
    this.groupSelectionService.selectGroup(group);
  }
  private unselectGroup(group: Group) {
    this.groupSelectionService.unselectGroup(group);
  }

  private isInSelection(groupToCheck: Group): boolean {
    return this.groupSelectionService.getSelectedGroups()
      .map(group => group.id)
      .includes(groupToCheck.id);
  }

  private findPreselectedGroups(groupTableData: GroupTableRow[]) {
    return groupTableData.filter(groupDatum =>
      this.isInSelection(groupDatum.group));
  }
  private markCheckboxes(groupTableData: GroupTableRow[]) {
    this.selection.select(...groupTableData);
  }

  private openEditGroupPopup(group: Group) {
    this.dialog.open(GroupEditComponent, { data: group })
      .afterClosed()
      .subscribe(result => {
        if ((result !== undefined || result !== null) && result === DialogResultEnum.SUCCESS) {
          this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS, 'Group was successfully updated'));
          this.fetchData();
        }
      });
  }

  private openAddUsersToGroupPopup(group: Group) {
    this.dialog.open(AddUsersToGroupComponent, { data: group })
      .afterClosed()
      .subscribe( result => {
        if ((result !== undefined || result !== null) && result === DialogResultEnum.SUCCESS) {
          this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS, 'Users were successfully added'));
          this.fetchData();
        }
      });
  }

  private openAddRolesToGroupPopup(group: Group) {
    this.dialog.open(AddRolesToGroupComponent, { data: group })
      .afterClosed()
      .subscribe( result => {
        this.displayAlertBasedOnRolesPopupResult(result);
        if (result !== undefined && result !== null && result.status !== DialogResultEnum.CANCELED) {
          this.fetchData();
        }
        });
  }

  private displayAlertBasedOnRolesPopupResult(result: any) {
    if (result === undefined || result === null || result.status === DialogResultEnum.CANCELED) {
      return;
    } else if (result.status === DialogResultEnum.SUCCESS) {
      this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS, 'Roles were successfully added'));
      this.fetchData();
    } else if (result.status === DialogResultEnum.FAILED) {
      this.alertService.notify(new Kypo2UserAndGroupNotification(
        Kypo2UserAndGroupNotificationType.ERROR,
        `Adding ${result.failedCount} role(s) of ${result.totalCount} requested failed.`));
    }
  }

  private subscribeForEvents() {
    this.dataChangeSubscription = this.groupSelectionService.dataChange$
      .subscribe(change => this.fetchData());
    this.selectionChangeSubscription = this.groupSelectionService.selectionChange$
      .subscribe(groupsCount => this.selectedGroupsCount = groupsCount);
  }
}
