import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {Set} from 'typescript-collections';
import {MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {UserRole} from 'kypo2-auth';

@Component({
  selector: 'kypo2-roles-table',
  templateUrl: './roles-table.component.html',
  styleUrls: ['./roles-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RolesTableComponent implements OnInit, OnChanges {

  @Input() group: Group;
  @Input() roles: UserRole[];
  @Output() roleSelectionChange: EventEmitter<UserRole[]> = new EventEmitter();

  selectedRoles: Set<UserRole> = new Set<UserRole>(role => role.id.toString());
  displayedColumns: string[] = ['select', 'name', 'microservice'];
  expandedRow: UserRole;
  selectedRolesCount = 0;
  totalRolesCount: number;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: MatTableDataSource<UserRole>;
  selection = new SelectionModel<UserRole>(true, []);

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('roles' in changes && this.roles) {
      this.createDataSource(this.roles);
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

  selectChange(event: MatCheckboxChange, role: UserRole) {
    if (event.checked) {
      this.selectRole(role);
    } else {
      this.unselectRole(role);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.dataSource._pageData(this.dataSource.data).length;
  }

    /**
   * Creates table data source from fetched data
   * @param roles array of roles
   */
  private createDataSource(roles: UserRole[]) {
    this.selectedRolesCount = 0;
    this.dataSource = new MatTableDataSource(roles);
    this.dataSource.paginator = this.paginator;
    this.totalRolesCount = this.dataSource.data.length;
    this.paginator.page.subscribe(pageChange => {
      this.selection.clear();
      this.markCheckboxes(this.findPreselectedRoles(this.dataSource._pageData(this.dataSource.data)));
    });
    this.dataSource.filterPredicate =
      (data: UserRole, filter: string) =>
        (data.roleType && data.roleType.toLowerCase().indexOf(filter) !== -1)
        || (data.microserviceName && data.microserviceName.toLowerCase().indexOf(filter) !== -1);
  }

  private unselectAll() {
    this.dataSource._pageData(this.dataSource.data).forEach(role =>
      this.selectedRoles.remove(role));
    this.selection.clear();
    this.selectedRolesCount = this.selectedRoles.size();
    this.roleSelectionChange.emit(this.selectedRoles.toArray());
  }

  private selectAll() {
    this.dataSource._pageData(this.dataSource.data).forEach(row => {
      this.selection.select(row);
      this.selectedRoles.add(row);
    });
    this.selectedRolesCount = this.selectedRoles.size();
    this.roleSelectionChange.emit(this.selectedRoles.toArray());
  }

  private selectRole(role: UserRole) {
    this.selectedRoles.add(role);
    this.selection.select(role);
    this.selectedRolesCount = this.selectedRoles.size();
    this.roleSelectionChange.emit(this.selectedRoles.toArray());
  }

  private unselectRole(role: UserRole) {
    this.selectedRoles.remove(role);
    this.selection.deselect(role);
    this.selectedRolesCount = this.selectedRoles.size();
    this.roleSelectionChange.emit(this.selectedRoles.toArray());
  }

  private isInSelection(roleToCheck: UserRole): boolean {
    return this.selectedRoles.toArray()
      .map(role => role.id)
      .includes(roleToCheck.id);
  }

  private findPreselectedRoles(roles: UserRole[]): UserRole[] {
    return roles.filter(role => this.isInSelection(role));
  }

  private markCheckboxes(roles: UserRole[]) {
    this.selection.select(...roles);
  }
}
