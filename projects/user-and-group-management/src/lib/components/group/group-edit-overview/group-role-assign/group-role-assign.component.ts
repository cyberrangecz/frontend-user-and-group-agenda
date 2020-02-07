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

/**
 * Component for role assignment to edited group
 */
@Component({
  selector: 'kypo2-group-role-assign',
  templateUrl: './group-role-assign.component.html',
  styleUrls: ['./group-role-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupRoleAssignComponent extends BaseComponent implements OnInit, OnChanges {

  /**
   * Edited group to assign roles to
   */
  @Input() resource: Group;

  /**
   * Event emitter of changes state
   */
  @Output() hasUnsavedChanges: EventEmitter<boolean> = new EventEmitter();

  /**
   * Roles available to assign to edited group
   */
  roles$: Observable<UserRole[]>;

  /**
   * Mapping of role model attributes to selector component
   */
  roleMapping: Kypo2SelectorResourceMapping;

  /**
   * True if error was thrown while getting data for table of already assigned roles, false otherwise
   */
  assignedRolesHasError$: Observable<boolean>;

  /**
   * Data for assigned roles table component
   */
  assignedRoles$: Observable<Kypo2Table<UserRole>>;

  /**
   * True if getting data for table component is in progress, false otherwise
   */
  isLoadingAssignedRoles$: Observable<boolean>;

  /**
   * Selected roles available to assign to edited group
   */
  selectedRolesToAssign: UserRole[] = [];

  /**
   * Selected roles already assigned to edited group
   */
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

  /**
   * Changes internal state of the component when roles to assign are selected
   * @param selected selected roles available to assign to edited group
   */
  onRolesToAssignSelection(selected: UserRole[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedRolesToAssign = selected;
  }

  /**
   * Searches for roles available to assign
   * @param filterValue search value
   */
  search(filterValue: string) {
    this.roles$ = this.roleAssignService.getAvailableToAssign(filterValue)
      .pipe(
        map((resource: PaginatedResource<UserRole[]>) => resource.elements)
      );
  }

  /**
   * Calls service to assign selected roles to edited group
   */
  assignSelectedRoles() {
    this.roleAssignService.assign(this.resource.id, this.selectedRolesToAssign)
      .pipe(take(1))
      .subscribe(_ => {
        this.selectedRolesToAssign = [];
        this.hasUnsavedChanges.emit(this.calculateHasUnsavedChanges());
      });
  }


  /**
   * Resolves type of action and calls appropriate handler
   * @param tableAction action emitted from assigned roles table component
   */
  onAssignedRolesTableAction(tableAction: TableActionEvent<UserRole>) {
    if (tableAction.action.id === RoleTableCreator.DELETE_ACTION_ID) {
      this.deleteAssignedRole(tableAction.element);
    }
  }

  /**
   * Changes internal state of the component when assigned roles are selected
   * @param selected selected assigned roles
   */
  onAssignedRolesSelection(selected: UserRole[]) {
    this.selectedAssignedRoles = selected;
  }

  /**
   * Calls service to delete assigned role from edited group (removes the association)
   * @param role assigned role to delete
   */
  deleteAssignedRole(role: UserRole) {
    this.roleAssignService.unassign(this.resource.id, [role])
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onAssignedRolesDeleted());
  }

  /**
   * Calls service to delete assigned roles from edited group (removes the association)
   */
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
