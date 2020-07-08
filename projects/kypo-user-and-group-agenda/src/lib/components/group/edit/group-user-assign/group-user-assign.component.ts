import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RequestedPagination, SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { User } from 'kypo-user-and-group-model';
import { Group } from 'kypo-user-and-group-model';
import { SentinelTable, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { SentinelResourceSelectorMapping } from '@sentinel/components/resource-selector';
import { combineLatest, defer, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { GroupMemberTable } from '../../../../model/adapters/table/user/group-member-table';
import { DeleteControlItem } from '../../../../model/controls/delete-control-item';
import { SaveControlItem } from '../../../../model/controls/save-control-item';
import { UserAndGroupContext } from '../../../../services/shared/user-and-group-context.service';
import { UserAssignService } from '../../../../services/user/user-assign/user-assign.service';

/**
 * Component for user assignment to groups
 */
@Component({
  selector: 'kypo-group-user-assign',
  templateUrl: './group-user-assign.component.html',
  styleUrls: ['./group-user-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupUserAssignComponent extends SentinelBaseDirective implements OnInit, OnChanges {
  readonly MEMBERS_OF_GROUP_INIT_SORT_NAME = 'familyName';
  readonly MEMBERS_OF_GROUP_INIT_SORT_DIR = 'asc';

  /**
   * Edited group to assign to
   */
  @Input() resource: Group;

  /**
   * Event emitter of unsaved changes
   */
  @Output() hasUnsavedChanges: EventEmitter<boolean> = new EventEmitter();

  /**
   * Users available to assign
   */
  users$: Observable<User[]>;

  /**
   * Mapping of user model attributes to selector component
   */
  userMapping: SentinelResourceSelectorMapping;

  /**
   * Groups available to import (assign its users to edited group)
   */
  groups$: Observable<Group[]>;

  /**
   * Mapping of group model attribute to selector component
   */
  groupMapping: SentinelResourceSelectorMapping;

  /**
   * Data for table component of already assigned users
   */
  assignedUsers$: Observable<SentinelTable<User>>;

  /**
   * True if error was thrown while getting data for assigned users table component, false otherwise
   */
  assignedUsersHasError$: Observable<boolean>;

  /**
   * True if data loading for table component is in progress, false otherwise
   */
  isLoadingAssignedUsers$: Observable<boolean>;

  selectedUsersToAssign$: Observable<User[]>;
  selectedGroupsToImport$: Observable<Group[]>;

  assignUsersControls: SentinelControlItem[];
  assignedUsersControls: SentinelControlItem[];

  constructor(private userAssignService: UserAssignService, private configService: UserAndGroupContext) {
    super();
    this.userMapping = {
      id: 'id',
      title: 'name',
      subtitle: 'login',
      icon: 'picture',
    };
    this.groupMapping = {
      id: 'id',
      title: 'name',
    };
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('resource' in changes && this.resource && this.resource.id !== undefined) {
      this.init();
    }
  }

  onControlAction(controlItem: SentinelControlItem) {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  /**
   * Changes internal state of the component when users to assign are selected
   * @param users selected users to assign
   */
  onUserToAssignSelection(users: User[]) {
    this.userAssignService.setSelectedUsersToAssign(users);
  }

  /**
   * Changes internal state of the component when assigned users are selected in table component
   * @param users selected assigned users
   */
  onAssignedUsersSelection(users: User[]) {
    this.userAssignService.setSelectedAssignedUsers(users);
  }

  /**
   * Changes internal state of the component when groups to import are selected
   * @param groups selected groups to import
   */
  onGroupToImportSelection(groups: Group[]) {
    this.userAssignService.setSelectedGroupsToImport(groups);
  }

  /**
   * Searches for users to assign
   * @param filterValue search value
   */
  searchUsers(filterValue: string) {
    this.users$ = this.userAssignService
      .getUsersToAssign(this.resource.id, filterValue)
      .pipe(map((resource) => resource.elements));
  }

  /**
   * Searches for groups to import
   * @param filterValue search value
   */
  searchGroups(filterValue: string) {
    this.groups$ = this.userAssignService.getGroupsToImport(filterValue).pipe(map((resource) => resource.elements));
  }

  /**
   * Resolves type of action and calls appropriate handler
   * @param event action event emitted from assigned users table component
   */
  onAssignedUsersTableAction(event: TableActionEvent<User>) {
    event.action.result$.pipe(take(1)).subscribe();
  }

  /**
   * Calls service to get data for assigned users table
   * @param loadEvent event to load new data emitted by assigned users table component
   */
  onAssignedLoadEvent(loadEvent: LoadTableEvent) {
    this.userAssignService
      .getAssigned(this.resource.id, loadEvent.pagination, loadEvent.filter)
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe();
  }

  private init() {
    this.selectedUsersToAssign$ = this.userAssignService.selectedUsersToAssign$;
    this.selectedGroupsToImport$ = this.userAssignService.selectedGroupsToImport$;
    this.initTable();
    this.initAssignUsersControls();
    this.initAssignedUsersControls();
    this.initUnsavedChangesEmitter();
  }

  private initUnsavedChangesEmitter() {
    combineLatest([this.userAssignService.selectedGroupsToImport$, this.userAssignService.selectedUsersToAssign$])
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe((selections) => this.hasUnsavedChanges.emit(selections.some((selection) => selection.length > 0)));
  }

  private initAssignedUsersControls() {
    this.userAssignService.selectedAssignedUsers$.pipe(takeWhile((_) => this.isAlive)).subscribe((selection) => {
      this.assignedUsersControls = [
        new DeleteControlItem(
          selection.length,
          defer(() => this.userAssignService.unassignSelected(this.resource.id))
        ),
      ];
    });
  }

  private initAssignUsersControls() {
    const disabled$ = combineLatest([
      this.userAssignService.selectedUsersToAssign$,
      this.userAssignService.selectedGroupsToImport$,
    ]).pipe(map((selections) => selections[0].length <= 0 && selections[1].length <= 0));

    this.assignUsersControls = [
      new SaveControlItem(
        'Add',
        disabled$,
        defer(() => this.userAssignService.assignSelected(this.resource.id))
      ),
    ];
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(
        0,
        this.configService.config.defaultPaginationSize,
        this.MEMBERS_OF_GROUP_INIT_SORT_NAME,
        this.MEMBERS_OF_GROUP_INIT_SORT_DIR
      )
    );
    this.assignedUsers$ = this.userAssignService.assignedUsers$.pipe(
      map((paginatedUsers) => new GroupMemberTable(paginatedUsers, this.resource.id, this.userAssignService))
    );
    this.assignedUsersHasError$ = this.userAssignService.hasError$;
    this.isLoadingAssignedUsers$ = this.userAssignService.isLoadingAssigned$;
    this.onAssignedLoadEvent(initialLoadEvent);
  }
}
