/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SentinelBaseDirective, RequestedPagination, PaginatedResource } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Group } from '@muni-kypo-crp/user-and-group-model';
import { UserRole } from '@muni-kypo-crp/user-and-group-model';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { SentinelResourceSelectorMapping } from '@sentinel/components/resource-selector';
import { defer, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { GroupRolesTable } from '../../model/table/group-roles-table';
import { DeleteControlItem, SaveControlItem, PaginationService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { RoleAssignService } from '../../services/state/role-assign/role-assign.service';
import { RoleAssignConcreteService } from '../../services/state/role-assign/role-assign-concrete.service';

/**
 * Component for role assignment to edited group-overview
 */
@Component({
  selector: 'kypo-group-role-assign',
  templateUrl: './group-role-assign.component.html',
  styleUrls: ['./group-role-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: RoleAssignService, useClass: RoleAssignConcreteService }],
})
export class GroupRoleAssignComponent extends SentinelBaseDirective implements OnChanges {
  readonly ROLES_OF_GROUP_INIT_SORT_NAME = 'roleType';
  readonly ROLES_OF_GROUP_INIT_SORT_DIR = 'asc';

  /**
   * Edited group-overview to assign roles to
   */
  @Input() resource: Group;

  /**
   * Event emitter of changes state
   */
  @Output() hasUnsavedChanges: EventEmitter<boolean> = new EventEmitter();

  /**
   * Roles available to assign to edited group-overview
   */
  roles$: Observable<UserRole[]>;

  /**
   * Mapping of role model attributes to selector component
   */
  roleMapping: SentinelResourceSelectorMapping;

  /**
   * True if error was thrown while getting data for table of already assigned roles, false otherwise
   */
  assignedRolesHasError$: Observable<boolean>;

  /**
   * Data for assigned roles table component
   */
  assignedRoles$: Observable<SentinelTable<UserRole>>;

  /**
   * True if getting data for table component is in progress, false otherwise
   */
  isLoadingAssignedRoles$: Observable<boolean>;

  /**
   * Selected roles available to assign to edited group-overview
   */
  selectedRolesToAssign$: Observable<UserRole[]>;

  rolesToAssignControls: SentinelControlItem[];
  assignedRolesControls: SentinelControlItem[];

  constructor(private roleAssignService: RoleAssignService, private paginationService: PaginationService) {
    super();
    this.roleMapping = {
      id: 'id',
      title: 'roleType',
      subtitle: 'microserviceName',
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('resource' in changes && this.resource && this.resource.id !== undefined) {
      this.init();
    }
  }

  onControlAction(controlItem: SentinelControlItem): void {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Searches for roles available to assign
   * @param filterValue search value
   */
  search(filterValue: string): void {
    this.roles$ = this.roleAssignService
      .getAvailableToAssign(filterValue)
      .pipe(map((resource: PaginatedResource<UserRole>) => resource.elements));
  }

  /**
   * Changes internal state of the component when roles to assign are selected
   * @param selected selected roles available to assign to edited group-overview
   */
  onRolesToAssignSelection(selected: UserRole[]): void {
    this.roleAssignService.setSelectedRolesToAssign(selected);
  }

  onAssignedRolesLoad(event: LoadTableEvent): void {
    this.paginationService.setPagination(event.pagination.size);
    this.roleAssignService
      .getAssigned(this.resource.id, event.pagination, event.filter)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  /**
   * Resolves type of action and calls appropriate handler
   * @param event action emitted from assigned roles table component
   */
  onAssignedRolesTableAction(event: TableActionEvent<UserRole>): void {
    event.action.result$.pipe(take(1)).subscribe();
  }

  /**
   * Changes internal state of the component when assigned roles are selected
   * @param selected selected assigned roles
   */
  onAssignedRolesSelection(selected: UserRole[]): void {
    this.roleAssignService.setSelectedAssignedRoles(selected);
  }

  private init() {
    this.selectedRolesToAssign$ = this.roleAssignService.selectedRolesToAssign$;
    this.initTable();
    this.initAssignedRolesControls();
    this.initRolesToAssignControls();
    this.initUnsavedChangesEmitter();
  }

  private initTable() {
    this.assignedRoles$ = this.roleAssignService.assignedRoles$.pipe(
      map((resource) => new GroupRolesTable(resource, this.resource.id, this.roleAssignService))
    );
    this.assignedRolesHasError$ = this.roleAssignService.hasError$;
    this.isLoadingAssignedRoles$ = this.roleAssignService.isLoadingAssigned$;
    const initialLoadEvent = new LoadTableEvent(
      new RequestedPagination(
        0,
        this.paginationService.getPagination(),
        this.ROLES_OF_GROUP_INIT_SORT_NAME,
        this.ROLES_OF_GROUP_INIT_SORT_DIR
      )
    );
    this.onAssignedRolesLoad(initialLoadEvent);
  }

  private initAssignedRolesControls() {
    this.roleAssignService.selectedAssignedRoles$.pipe(takeWhile(() => this.isAlive)).subscribe((selection) => {
      this.assignedRolesControls = [
        new DeleteControlItem(
          selection.length,
          defer(() => this.roleAssignService.unassignSelected(this.resource.id))
        ),
      ];
    });
  }
  private initRolesToAssignControls() {
    const disabled$ = this.roleAssignService.selectedRolesToAssign$.pipe(map((selection) => selection.length <= 0));
    this.rolesToAssignControls = [
      new SaveControlItem(
        'Add',
        disabled$,
        defer(() => this.roleAssignService.assignSelected(this.resource.id))
      ),
    ];
  }

  private initUnsavedChangesEmitter() {
    this.roleAssignService.selectedRolesToAssign$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((selection) => this.hasUnsavedChanges.emit(selection.length > 0));
  }
}
