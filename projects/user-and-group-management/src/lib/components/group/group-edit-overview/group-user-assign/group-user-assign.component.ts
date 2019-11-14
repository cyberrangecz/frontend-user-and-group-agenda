import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {Observable} from 'rxjs';
import {User} from 'kypo2-auth';
import {Kypo2SelectorResourceMapping} from 'kypo2-user-assign/lib/model/kypo2-selector-resource-mapping';
import {Kypo2Table, LoadTableEvent, TableActionEvent} from 'kypo2-table';
import {BaseComponent} from '../../../../model/base-component';
import {UserAssignService} from '../../../../services/user/user-assign.service';
import {RequestedPagination} from '../../../../model/other/requested-pagination';
import {ConfigService} from '../../../../config/config.service';
import {map, takeWhile} from 'rxjs/operators';
import {GroupMemberTableCreator} from '../../../../model/table-adapters/group-member-table-creator';

@Component({
  selector: 'kypo2-group-user-assign',
  templateUrl: './group-user-assign.component.html',
  styleUrls: ['./group-user-assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupUserAssignComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() resource: Group;
  @Output() hasUnsavedChanges: EventEmitter<boolean> = new EventEmitter();

  users$: Observable<User[]>;
  userMapping: Kypo2SelectorResourceMapping;
  groups$: Observable<Group[]>;
  groupMapping: Kypo2SelectorResourceMapping;

  assignedUsersHasError$: Observable<boolean>;
  assignedUsers$: Observable<Kypo2Table<User>>;
  isLoadingAssignedUsers$:  Observable<boolean>;
  assignedUsersTotalLength$: Observable<number>;

  selectedUsersToAssign: User[] = [];
  selectedGroupsToImport: Group[] = [];
  selectedAssignedUsers: User[] = [];

  constructor(private userAssignService: UserAssignService,
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

  onUserToAssignSelection(users: User[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedUsersToAssign = users;
  }

  onAssignedUsersSelection(users: User[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedAssignedUsers = users;
  }

  onGroupToImportSelection(groups: Group[]) {
    this.hasUnsavedChanges.emit(true);
    this.selectedGroupsToImport = groups;
  }

  searchUsers(filterValue: string) {
    this.users$ = this.userAssignService.getUsersToAssign(this.resource.id, filterValue)
      .pipe(
        map(resource => resource.elements),
      );
  }

  searchGroups(filterValue: string) {
    this.groups$ = this.userAssignService.getGroupsToImport(filterValue)
      .pipe(
        map(resource => resource.elements),
      );
  }

  deleteAssignedUser(user: User) {
    this.userAssignService.unassign(this.resource.id, [user])
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onAssignedUsersDeleted());
  }

  deleteSelectedAssignedUsers() {
    this.userAssignService.unassign(this.resource.id, this.selectedAssignedUsers)
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onAssignedUsersDeleted());
  }

  onAssignedUsersTableAction(event: TableActionEvent<User>) {
    if (event.action.label.toLowerCase() === 'delete') {
      this.deleteAssignedUser(event.element);
    }
  }

  onAssignedLoadEvent(loadEvent: LoadTableEvent) {
    this.userAssignService.getAssigned(this.resource.id, loadEvent.pagination, loadEvent.filter)
      .pipe(
        takeWhile(_ => this.isAlive),
      )
      .subscribe();
  }

  private initTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.configService.config.defaultPaginationSize, '', ''));
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
