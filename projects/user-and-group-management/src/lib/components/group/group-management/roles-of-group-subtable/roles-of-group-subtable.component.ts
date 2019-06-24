import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Role} from '../../../../model/role/role.model';
import {GroupFacadeService} from '../../../../services/group/group-facade.service';
import {AlertService} from '../../../../services/alert/alert.service';
import {Alert} from '../../../../model/alert/alert.model';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {SelectionModel} from '@angular/cdk/collections';
import {Set} from 'typescript-collections';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ErrorHandlerService} from '../../../../services/alert/error-handler.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'kypo2-roles-of-group-subtable',
  templateUrl: './roles-of-group-subtable.component.html',
  styleUrls: ['./roles-of-group-subtable.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RolesOfGroupSubtableComponent implements OnInit, OnDestroy {

  @Input() group: Group;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns = ['select', 'name', 'microservice', 'remove'];
  expandedRow: Role;
  dataSource: MatTableDataSource<Role>;
  selection = new SelectionModel<Role>(true, []);

  selectedRolesCount = 0;
  totalRolesCount = 0;
  selectedRoles: Set<Role> = new Set<Role>(role => role.id.toString());

  private paginationChangeSubscription: Subscription;


  constructor(private groupFacade: GroupFacadeService,
              private errorHandler: ErrorHandlerService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.createDataSource();
  }

  ngOnDestroy(): void {
    if (this.paginationChangeSubscription) {
      this.paginationChangeSubscription.unsubscribe();
    }
  }

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

  selectChange(event: MatCheckboxChange, role: Role) {
    if (event.checked) {
      this.selectRole(role);
    } else {
      this.unselectRole(role);
    }
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource._pageData(this.dataSource.data).length;
  }

  removeRoleFromGroup(role: Role) {
    this.groupFacade.removeRoleFromGroup(this.group.id, role.id)
      .subscribe(
        resp => {
          this.deleteRemovedRoleFromTable(role);
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'Role was successfully removed'));
          this.resetSelection();
        },
        err => this.errorHandler.displayInAlert(err, 'Removing role')
      );
  }

  removeSelectedRolesFromGroup() {
    forkJoin(this.selectedRoles.toArray().map(role =>
      this.sendRemoveRoleFromGroupRequestWithoutError(role)))
      .subscribe(
        results => {
          const failedRequests = results.filter(result => result === 'failed');
          this.resetSelection();
          this.evaluateMultipleRoleRemovalRequests(failedRequests, results.length);
        }
      );
  }

  private sendRemoveRoleFromGroupRequestWithoutError(role: Role): Observable<any> {
    return this.groupFacade.removeRoleFromGroup(this.group.id, role.id)
      .pipe(map(
        resp => {
          this.deleteRemovedRoleFromTable(role);
          return resp;
        }),
        catchError(error => of('failed'))
      );
  }

  private evaluateMultipleRoleRemovalRequests(failedRequests, totalCount: number) {
    if (failedRequests.length > 0) {
      this.alertService.addAlert(new Alert(
        AlertType.ERROR,
        `${failedRequests.length} of ${totalCount} roles were not successfully removed.`));
    } else {
      this.alertService.addAlert(new Alert(
        AlertType.SUCCESS,
        'Roles were successfully removed'
      ));
    }
  }


  private deleteRemovedRoleFromTable(removedRole: Role) {
    this.group.roles = this.group.roles.filter(role =>
      !(role.id === removedRole.id));
    this.createDataSource();
  }

  private unselectAll() {
    this.dataSource._pageData(this.dataSource.data).forEach(role =>
      this.selectedRoles.remove(role));
    this.selection.clear();
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private selectAll() {
    this.dataSource._pageData(this.dataSource.data).forEach(role => {
      this.selection.select(role);
      this.selectedRoles.add(role);
    });
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private selectRole(role: Role) {
    this.selectedRoles.add(role);
    this.selection.select(role);
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private unselectRole(role: Role) {
    this.selectedRoles.remove(role);
    this.selection.deselect(role);
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private createDataSource() {
    this.dataSource = new MatTableDataSource(this.group.roles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalRolesCount = this.dataSource.data.length;
    this.paginationChangeSubscription = this.paginator.page.subscribe(pageChange => {
      this.selection.clear();
      this.markCheckboxes(this.findPreselectedRoles(this.dataSource._pageData(this.dataSource.data)));
    });
  }

  private resetSelection() {
    this.selection.clear();
    this.selectedRoles.clear();
    this.totalRolesCount = this.dataSource.data.length;
    this.selectedRolesCount = 0;
  }

  private isInSelection(roleToCheck: Role): boolean {
    return this.selectedRoles.toArray()
      .map(role => role.id)
      .includes(roleToCheck.id);
  }

  private findPreselectedRoles(roles: Role[]): Role[] {
    return roles.filter(role => this.isInSelection(role));
  }
  private markCheckboxes(roles: Role[]) {
    this.selection.select(...roles);
  }
}
