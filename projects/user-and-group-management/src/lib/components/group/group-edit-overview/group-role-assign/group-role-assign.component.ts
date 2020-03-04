import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BaseComponent} from '../../../../model/base-component';
import {defer, Observable} from 'rxjs';
import {UserRole} from 'kypo2-auth';
import {Kypo2SelectorResourceMapping} from 'kypo2-user-assign/lib/model/kypo2-selector-resource-mapping';
import {Kypo2Table, TableActionEvent} from 'kypo2-table';
import {Kypo2RoleAssignService} from '../../../../services/role/kypo2-role-assign.service';
import {map, take, takeWhile} from 'rxjs/operators';
import {GroupRolesTable} from '../../../../model/table/role/group-roles-table';
import {Group} from '../../../../model/group/group.model';
import {PaginatedResource} from '../../../../model/table/paginated-resource';
import {KypoControlItem} from 'kypo-controls';
import {DeleteControlItem} from '../../../../model/controls/delete-control-item';
import {SaveControlItem} from '../../../../model/controls/save-control-item';

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
  selectedRolesToAssign$: Observable<UserRole[]>;

  rolesToAssignControls: KypoControlItem[];
  assignedRolesControls: KypoControlItem[];

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
      this.init();
    }
  }

  onControlAction(controlItem: KypoControlItem) {
    controlItem.result$
      .pipe(
        take(1)
      ).subscribe();
  }

  /**
   * Searches for roles available to assign
   * @param filterValue search value
   */
  search(filterValue: string) {
    this.roles$ = this.roleAssignService.getAvailableToAssign(filterValue)
      .pipe(
        map((resource: PaginatedResource<UserRole>) => resource.elements)
      );
  }

  /**
   * Resolves type of action and calls appropriate handler
   * @param event action emitted from assigned roles table component
   */
  onAssignedRolesTableAction(event: TableActionEvent<UserRole>) {
    event.action.result$
      .pipe(
        take(1)
      ).subscribe();
  }

  /**
   * Changes internal state of the component when assigned roles are selected
   * @param selected selected assigned roles
   */
  onAssignedRolesSelection(selected: UserRole[]) {
    this.roleAssignService.setSelectedAssignedRoles(selected);
  }

  /**
   * Changes internal state of the component when roles to assign are selected
   * @param selected selected roles available to assign to edited group
   */
  onRolesToAssignSelection(selected: UserRole[]) {
    this.roleAssignService.setSelectedRolesToAssign(selected);
  }

  private init() {
    this.selectedRolesToAssign$ = this.roleAssignService.selectedRolesToAssign$;
    this.initTable();
    this.initAssignedRolesControls();
    this.initRolesToAssignControls();
    this.initUnsavedChangesEmitter();
  }

  private initTable() {
    this.assignedRoles$ = this.roleAssignService.assignedRoles$
      .pipe(
        map(roles => new GroupRolesTable(roles, this.resource.id, this.roleAssignService))
      );
    this.assignedRolesHasError$ = this.roleAssignService.hasError$;
    this.isLoadingAssignedRoles$ = this.roleAssignService.isLoadingAssigned$;
    this.roleAssignService.getAssigned(this.resource.id)
      .pipe(take(1))
      .subscribe();
  }

  private initAssignedRolesControls() {
    this.roleAssignService.selectedAssignedRoles$
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(selection => {
      this.assignedRolesControls = [
        new DeleteControlItem(selection.length,
          defer(() => this.roleAssignService.unassignSelected(this.resource.id))
        )];
    });

  }
  private initRolesToAssignControls() {
    const disabled$ = this.roleAssignService.selectedRolesToAssign$
      .pipe(
        map(selection => selection.length <= 0)
      );
    this.rolesToAssignControls = [
      new SaveControlItem('Add',
        disabled$,
        defer(() => this.roleAssignService.assignSelected(this.resource.id))
      )];
  }

  private initUnsavedChangesEmitter() {
    this.roleAssignService.selectedRolesToAssign$
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(selection => this.hasUnsavedChanges.emit(selection.length > 0));
  }
}
