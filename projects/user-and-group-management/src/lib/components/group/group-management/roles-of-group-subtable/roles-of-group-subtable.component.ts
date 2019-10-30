import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Group } from '../../../../model/group/group.model';
import { MatCheckboxChange, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { GroupFacadeService } from '../../../../services/facade/group/group-facade.service';
import { Kypo2UserAndGroupNotificationService } from '../../../../services/notification/kypo2-user-and-group-notification.service';
import { Notification } from '../../../../model/alert/alert.model';
import { NotificationType } from '../../../../model/enums/alert-type.enum';
import { SelectionModel } from '@angular/cdk/collections';
import { Set } from 'typescript-collections';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlerService } from '../../../../services/notification/error-handler.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserRole } from 'kypo2-auth';
import { RoleTableRow } from '../../../../model/table-adapters/role-table-row';
import { StringNormalizer } from '../../../../model/utils/string-normalizer';
import { GroupTableRow } from '../../../../model/table-adapters/group-table-row';

@Component({
  selector: 'kypo2-roles-of-group-subtable',
  templateUrl: './roles-of-group-subtable.component.html',
  styleUrls: ['./roles-of-group-subtable.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RolesOfGroupSubtableComponent implements OnInit, OnDestroy {

  @Input() group: Group;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = ['select', 'name', 'microservice', 'remove'];
  expandedRow: RoleTableRow;
  dataSource: MatTableDataSource<RoleTableRow>;
  selection = new SelectionModel<UserRole>(true, []);

  selectedRolesCount = 0;
  totalRolesCount = 0;
  selectedRoles: Set<UserRole> = new Set<UserRole>(role => role.id.toString());

  private paginationChangeSubscription: Subscription;


  constructor(private groupFacade: GroupFacadeService,
    private errorHandler: ErrorHandlerService,
    private alertService: Kypo2UserAndGroupNotificationService) { }

  ngOnInit() {
    this.createDataSource();
  }

  ngOnDestroy(): void {
    if (this.paginationChangeSubscription) {
      this.paginationChangeSubscription.unsubscribe();
    }
  }

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

  selectChange(event: MatCheckboxChange, role: UserRole) {
    if (event.checked) {
      this.selectRole(role);
    } else {
      this.unselectRole(role);
    }
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource._pageData(this.dataSource.data).length;
  }

  removeRoleFromGroup(role: UserRole) {
    this.groupFacade.removeRoleFromGroup(this.group.id, role.id)
      .subscribe(
        resp => {
          this.deleteRemovedRoleFromTable(role);
          this.alertService.addNotification(new Notification(NotificationType.SUCCESS, 'Role was successfully removed'));
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

  private sendRemoveRoleFromGroupRequestWithoutError(role: UserRole): Observable<any> {
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
      this.alertService.addNotification(new Notification(
        NotificationType.ERROR,
        `${failedRequests.length} of ${totalCount} roles were not successfully removed.`));
    } else {
      this.alertService.addNotification(new Notification(
        NotificationType.SUCCESS,
        'Roles were successfully removed'
      ));
    }
  }


  private deleteRemovedRoleFromTable(removedRole: UserRole) {
    this.group.roles = this.group.roles.filter(role =>
      !(role.id === removedRole.id));
    this.createDataSource();
  }

  private unselectAll() {
    this.dataSource._pageData(this.dataSource.data).forEach(row =>
      this.selectedRoles.remove(row.role));
    this.selection.clear();
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private selectAll() {
    this.dataSource._pageData(this.dataSource.data).forEach(row => {
      this.selection.select(row.role);
      this.selectedRoles.add(row.role);
    });
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private selectRole(role: UserRole) {
    this.selectedRoles.add(role);
    this.selection.select(role);
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private unselectRole(role: UserRole) {
    this.selectedRoles.remove(role);
    this.selection.deselect(role);
    this.selectedRolesCount = this.selectedRoles.size();
  }

  private createDataSource() {
    this.dataSource = new MatTableDataSource(this.group.roles.map(role => new RoleTableRow(role)));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalRolesCount = this.dataSource.data.length;
    this.dataSource.filterPredicate =
      (row: RoleTableRow, filter: string) =>
        row.normalizedRoleName.indexOf(filter) !== -1 || row.normalizedMicroserviceName.indexOf(filter) !== -1;
    this.paginationChangeSubscription = this.paginator.page.subscribe(pageChange => {
      this.selection.clear();
      this.markCheckboxes(this.findPreselectedRoles(this.dataSource._pageData(this.dataSource.data).map(row => row.role)));
    });
  }

  private resetSelection() {
    this.selection.clear();
    this.selectedRoles.clear();
    this.totalRolesCount = this.dataSource.data.length;
    this.selectedRolesCount = 0;
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
