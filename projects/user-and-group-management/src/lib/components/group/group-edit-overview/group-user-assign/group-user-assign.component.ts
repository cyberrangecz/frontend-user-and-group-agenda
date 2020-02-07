import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {Observable} from 'rxjs';
import {User} from 'kypo2-auth';
import {Kypo2SelectorResourceMapping} from 'kypo2-user-assign/lib/model/kypo2-selector-resource-mapping';
import {Kypo2Table, LoadTableEvent, TableActionEvent} from 'kypo2-table';
import {BaseComponent} from '../../../../model/base-component';
import {Kypo2UserAssignService} from '../../../../services/user/kypo2-user-assign.service';
import {RequestedPagination} from '../../../../model/other/requested-pagination';
import {ConfigService} from '../../../../config/config.service';
import {map, takeWhile} from 'rxjs/operators';
import {GroupMemberTableCreator} from '../../../../model/table-adapters/group-member-table-creator';

/**
 * Component for user assignment to groups
 */
@Component({
  selector: 'kypo2-group-user-assign',
  templateUrl: './group-user-assign.component.html',
  styleUrls: ['./group-user-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupUserAssignComponent extends BaseComponent implements OnInit, OnChanges {

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
  userMapping: Kypo2SelectorResourceMapping;

  /**
   * Groups available to import (assign its users to edited group)
   */
  groups$: Observable<Group[]>;

  /**
   * Mapping of group model attribute to selector componnet
   */
  groupMapping: Kypo2SelectorResourceMapping;

  /**
   * Data for table component of already assigned users
   */
  assignedUsers$: Observable<Kypo2Table<User>>;

  /**
   * True if error was thrown while getting data for assigned users table component, false otherwise
   */
  assignedUsersHasError$: Observable<boolean>;

  /**
   * True if data loading for table component is in progress, false otherwise
   */
  isLoadingAssignedUsers$:  Observable<boolean>;

  /**
   * Number of total assigned users
   */
  assignedUsersTotalLength$: Observable<number>;

  /**
   * Users selected to assign to edited group
   */
  selectedUsersToAssign: User[] = [];

  /**
   * Groups selected to be imported to edited group
   */
  selectedGroupsToImport: Group[] = [];

  /**
   * Selected users already assigned to edited group
   */
  selectedAssignedUsers: User[] = [];

  constructor(private userAssignService: Kypo2UserAssignService,
              private configService: ConfigService) {
    super();
    this.userMapping = {
      id: 'id',
      title: 'name',
      subtitle: 'login',
      icon: 'picture'
    };
    this.groupMapping = {
      id: 'id',
      title: 'name'
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
   * Calls service to assign selected users and users of groups selected to import to edited group
   */
  assign() {
    this.userAssignService.assign(this.resource.id, this.selectedUsersToAssign, this.selectedGroupsToImport)
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => {
      this.selectedUsersToAssign = [];
      this.selectedGroupsToImport = [];
      this.hasUnsavedChanges.emit(this.calculateHasUnsavedChanges());
    });
  }

  /**
   * Changes internal state of the component when users to assign are selected
   * @param users selected users to assign
   */
  onUserToAssignSelection(users: User[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedUsersToAssign = users;
  }

  /**
   * Changes internal state of the component when assigned users are selected in table component
   * @param users selected assigned users
   */
  onAssignedUsersSelection(users: User[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedAssignedUsers = users;
  }

  /**
   * Changes internal state of the component when groups to import are selected
   * @param groups selected groups to import
   */
  onGroupToImportSelection(groups: Group[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedGroupsToImport = groups;
  }

  /**
   * Searches for users to assign
   * @param filterValue search value
   */
  searchUsers(filterValue: string) {
    this.users$ = this.userAssignService.getUsersToAssign(this.resource.id, filterValue)
      .pipe(
        map(resource => resource.elements),
      );
  }

  /**
   * Searches for groups to import
   * @param filterValue search value
   */
  searchGroups(filterValue: string) {
    this.groups$ = this.userAssignService.getGroupsToImport(filterValue)
      .pipe(
        map(resource => resource.elements),
      );
  }

  /**
   * Calls service to delete selected assigned users from group (cancel their association)
   */
  deleteSelectedAssignedUsers() {
    this.userAssignService.unassign(this.resource.id, this.selectedAssignedUsers)
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onAssignedUsersDeleted());
  }

  /**
   * Resolves type of action and calls appropriate handler
   * @param event action event emitted from assigned users table component
   */
  onAssignedUsersTableAction(event: TableActionEvent<User>) {
    if (event.action.id === GroupMemberTableCreator.DELETE_ACTION_ID) {
      this.deleteAssignedUser(event.element);
    }
  }

  /**
   * Calls service to get data for assigned users table
   * @param loadEvent event to load new data emitted by assigned users table component
   */
  onAssignedLoadEvent(loadEvent: LoadTableEvent) {
    this.userAssignService.getAssigned(this.resource.id, loadEvent.pagination, loadEvent.filter)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  /**
   * Calls service to delete assigned user from group (cancel the association)
   * @param user user to delete from group
   */
  private deleteAssignedUser(user: User) {
    this.userAssignService.unassign(this.resource.id, [user])
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onAssignedUsersDeleted());
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.configService.config.defaultPaginationSize, this.MEMBERS_OF_GROUP_INIT_SORT_NAME, this.MEMBERS_OF_GROUP_INIT_SORT_DIR));
    this.assignedUsers$ = this.userAssignService.assignedUsers$
      .pipe(
        map(paginatedUsers => GroupMemberTableCreator.create(paginatedUsers))
      );
    this.assignedUsersHasError$ = this.userAssignService.hasError$;
    this.assignedUsersTotalLength$ = this.userAssignService.totalLength$;
    this.isLoadingAssignedUsers$ = this.userAssignService.isLoadingAssigned$;
    this.onAssignedLoadEvent(initialLoadEvent);
  }

  private calculateHasUnsavedChanges(): boolean {
    return this.selectedAssignedUsers.length > 0
      || this.selectedUsersToAssign.length > 0
      || this.selectedGroupsToImport.length > 0;
  }

  private onAssignedUsersDeleted() {
    this.selectedAssignedUsers = [];
    this.hasUnsavedChanges.emit(this.calculateHasUnsavedChanges());
  }
}
