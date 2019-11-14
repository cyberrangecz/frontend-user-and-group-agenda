import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BaseComponent} from '../../../../model/base-component';
import {Observable} from 'rxjs';
import {UserRole} from 'kypo2-auth';
import {Kypo2SelectorResourceMapping} from 'kypo2-user-assign/lib/model/kypo2-selector-resource-mapping';
import {Kypo2Table, TableActionEvent} from 'kypo2-table';
import {Kypo2RoleAssignService} from '../../../../services/role/kypo2-role-assign.service';
import {map, take, takeWhile} from 'rxjs/operators';
import {RoleTableCreator} from '../../../../model/table-adapters/role-table-creator';
import {Group} from '../../../../model/group/group.model';
import {PaginatedResource} from '../../../../model/table-adapters/paginated-resource';

@Component({
  selector: 'kypo2-group-role-assign',
  templateUrl: './group-role-assign.component.html',
  styleUrls: ['./group-role-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupRoleAssignComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() resource: Group;
  @Output() hasUnsavedChanges: EventEmitter<boolean> = new EventEmitter();

  roles$: Observable<UserRole[]>;
  roleMapping: Kypo2SelectorResourceMapping;

  assignedRolesHasError$: Observable<boolean>;
  assignedRoles$: Observable<Kypo2Table<UserRole>>;
  isLoadingAssignedRoles$: Observable<boolean>;

  selectedRolesToAssign: UserRole[] = [];
  selectedAssignedRoles: UserRole[] = [];

  constructor(private roleAssignService: Kypo2RoleAssignService) {
    super();
    this.roleMapping = {
      id: 'id',
      title: 'roleType',
      subtitle: 'microserviceName'
    };
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('resource' in changes && this.resource && this.resource.id !== undefined) {
      this.initTable();
    }
  }

  onRolesToAssignSelection(selected: UserRole[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedRolesToAssign = selected;
  }

  search(filterValue: string) {
    this.roles$ = this.roleAssignService.getAvailableToAssign(filterValue)
      .pipe(
        map((resource: PaginatedResource<UserRole[]>) => resource.elements)
      );
  }

  assignSelectedRoles() {
    this.roleAssignService.assign(this.resource.id, this.selectedRolesToAssign)
      .pipe(take(1))
      .subscribe(_ => {
        this.selectedRolesToAssign = [];
        this.hasUnsavedChanges.emit(this.calculateHasUnsavedChanges());
      });
  }


  onAssignedRolesTableAction(tableAction: TableActionEvent<UserRole>) {
    if (tableAction.action.label.toLowerCase() === 'delete') {
      this.deleteAssignedRole(tableAction.element);
    }
  }

  onAssignedRolesSelection(selected: UserRole[]) {
    this.selectedAssignedRoles = selected;
  }

  deleteAssignedRole(role: UserRole) {
    this.roleAssignService.unassign(this.resource.id, [role])
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onAssignedRolesDeleted());
  }

  deleteSelectedRoles() {
    this.roleAssignService.unassign(this.resource.id, this.selectedAssignedRoles)
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onAssignedRolesDeleted());
  }

  private initTable() {
    this.assignedRoles$ = this.roleAssignService.assignedRoles$
      .pipe(
        map(roles => RoleTableCreator.create(roles))
      );
    this.assignedRolesHasError$ = this.roleAssignService.hasError$;
    this.isLoadingAssignedRoles$ = this.roleAssignService.isLoadingAssigned$;
    this.roleAssignService.getAssigned(this.resource.id)
      .pipe(take(1))
      .subscribe();
  }

  private onAssignedRolesDeleted() {
    this.selectedAssignedRoles = [];
    this.hasUnsavedChanges.emit(this.calculateHasUnsavedChanges());
  }

  private calculateHasUnsavedChanges() {
    return this.selectedRolesToAssign.length > 0 || this.selectedAssignedRoles.length > 0;
  }
}
