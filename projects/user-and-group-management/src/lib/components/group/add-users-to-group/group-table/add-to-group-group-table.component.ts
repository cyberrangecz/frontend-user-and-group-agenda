import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {Set} from 'typescript-collections';
import {MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {ConfigService} from '../../../../config/config.service';
import {AlertService} from '../../../../services/alert/alert.service';
import {GroupFacadeService} from '../../../../services/group/group-facade.service';
import {merge, Observable, of} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {Alert} from '../../../../model/alert/alert.model';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {TableDataWrapper} from '../../../../model/table-data/table-data-wrapper';
import {PaginationFactory} from '../../../../model/other/pagination-factory';

@Component({
  selector: 'kypo2-add-to-group-group-table',
  templateUrl: './add-to-group-group-table.component.html',
  styleUrls: ['./add-to-group-group-table.component.css']
})
export class AddToGroupGroupTableComponent implements OnInit, OnChanges {

  @Input() group: Group;
  @Output() groupSelectionChange: EventEmitter<Group[]> = new EventEmitter();

  selectedGroups: Set<Group> = new Set<Group>(groups => groups.id.toString());
  displayedColumns: string[] = ['select', 'name', 'description'];
  resultsLength = 0;
  isLoadingResults = true;
  isInErrorState = false;
  selectedGroupsCount = 0;
  totalGroupsCount: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Group>;
  selection = new SelectionModel<Group>(true, []);

  constructor(private groupFacade: GroupFacadeService,
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

  fetchData() {
    this.isInErrorState = false;
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.sendRequestToLoadGroups();
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.pagination.totalElements;
          return data;
        }),
        catchError((err) => {
          this.isLoadingResults = false;
          this.isInErrorState = true;
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Loading groups'), err);
          return of([]);
        }))
      .subscribe((data: TableDataWrapper<Group[]>) => this.createDataSource(data));
  }

  private createDataSource(dataWrapper: TableDataWrapper<Group[]>) {
    this.totalGroupsCount = dataWrapper.pagination.totalElements;
    this.selection.clear();
    this.markCheckboxes(this.findPreselectedGroups(dataWrapper.tableData));
    this.dataSource = new MatTableDataSource(dataWrapper.tableData);
    this.dataSource.filterPredicate =
      (data: Group, filter: string) =>
        data.name && data.name.toLowerCase().indexOf(filter) !== -1;
  }

  private initTableDataSource() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator.pageSize = this.configService.config.defaultPaginationSize;
    this.sort.active = 'name';
    this.sort.direction = 'desc';
    this.fetchData();
  }

  private unselectAll() {
    this.selection.selected.forEach(group => {
      this.selectedGroups.remove(group);
    });
    this.selection.clear();
    this.selectedGroupsCount = this.selectedGroups.size();
    this.groupSelectionChange.emit(this.selectedGroups.toArray());
  }

  private selectAll() {
    this.dataSource.data.forEach(group => {
      this.selectedGroups.add(group);
      this.selection.select(group);
    });
    this.selectedGroupsCount = this.selectedGroups.size();
    this.groupSelectionChange.emit(this.selectedGroups.toArray());
  }

  private selectGroup(group: Group) {
    this.selectedGroups.add(group);
    this.selectedGroupsCount = this.selectedGroups.size();
    this.groupSelectionChange.emit(this.selectedGroups.toArray());
  }

  private unselectGroup(group: Group) {
    this.selectedGroups.remove(group);
    this.selectedGroupsCount = this.selectedGroups.size();
    this.groupSelectionChange.emit(this.selectedGroups.toArray());
  }

  private sendRequestToLoadGroups(): Observable<TableDataWrapper<Group[]>> {
    const pagination = PaginationFactory.createWithSort(this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction);
      return this.groupFacade.getGroups(pagination);
  }

  private isInSelection(groupToCheck: Group): boolean {
    return this.selectedGroups.toArray()
      .map(group => group.id)
      .includes(groupToCheck.id);
  }

  private findPreselectedGroups(groups: Group[]): Group[] {
    return groups.filter(group => this.isInSelection(group));
  }
  private markCheckboxes(groups: Group[]) {
    this.selection.select(...groups);
  }
}
