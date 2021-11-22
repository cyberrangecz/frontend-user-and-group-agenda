import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group, User, UserRole } from '@muni-kypo-crp/user-and-group-model';
import { RequestedPagination, SentinelBaseDirective } from '@sentinel/common';
import { GROUP_DATA_ATTRIBUTE_NAME } from '@muni-kypo-crp/user-and-group-agenda';
import { map, takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MembersDetailTable } from '../model/members-detail-table';
import { RolesDetailTable } from '../model/roles-detail-table';
import { LoadTableEvent, SentinelTable } from '@sentinel/components/table';
import { PaginationService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { MembersDetailService } from '../services/members-detail.service';
import { RolesDetailService } from '../services/roles-detail.service';

@Component({
  selector: 'kypo-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent extends SentinelBaseDirective implements OnInit {
  readonly INIT_MEMBERS_SORT_NAME = 'familyName';
  readonly INIT_ROLES_SORT_NAME = 'roleType';
  readonly INIT_SORT_DIR = 'asc';

  group: Group;
  roles$: Observable<SentinelTable<UserRole>>;
  rolesTableHasError$: Observable<boolean>;
  isLoadingRoles$: Observable<boolean>;

  members$: Observable<SentinelTable<User>>;
  membersTableHasError$: Observable<boolean>;
  isLoadingMembers$: Observable<boolean>;

  constructor(
    private activeRoute: ActivatedRoute,
    private membersDetailService: MembersDetailService,
    private rolesDetailService: RolesDetailService,
    private paginationService: PaginationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initTables();
  }

  /**
   * Gets new data for group detail roles table
   * @param loadEvent load event emitted from roles detail table
   */
  onRolesLoadEvent(loadEvent: LoadTableEvent): void {
    this.paginationService.setPagination(loadEvent.pagination.size);
    this.rolesDetailService
      .getAssigned(this.group.id, loadEvent.pagination, loadEvent.filter)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  /**
   * Gets new data for group detail members table
   * @param loadEvent load event emitted from mmebers detail table
   */
  onMembersLoadEvent(loadEvent: LoadTableEvent): void {
    this.paginationService.setPagination(loadEvent.pagination.size);
    this.membersDetailService
      .getAssigned(this.group.id, loadEvent.pagination, loadEvent.filter)
      .pipe(takeWhile(() => this.isAlive))
      .subscribe();
  }

  private initTables(): void {
    this.activeRoute.data.pipe(takeWhile(() => this.isAlive)).subscribe((data) => {
      this.group = data[GROUP_DATA_ATTRIBUTE_NAME];
      this.initMembersTable();
      this.initRolesTable();
    });
  }

  private initMembersTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(
        0,
        this.paginationService.getPagination(),
        this.INIT_MEMBERS_SORT_NAME,
        this.INIT_SORT_DIR
      )
    );
    this.members$ = this.membersDetailService.assignedUsers$.pipe(map((resource) => new MembersDetailTable(resource)));
    this.membersTableHasError$ = this.membersDetailService.hasError$;
    this.isLoadingMembers$ = this.membersDetailService.isLoadingAssigned$;
    this.onMembersLoadEvent(initialLoadEvent);
  }

  private initRolesTable() {
    const initialLoadEvent: LoadTableEvent = new LoadTableEvent(
      new RequestedPagination(0, this.paginationService.getPagination(), this.INIT_ROLES_SORT_NAME, this.INIT_SORT_DIR)
    );
    this.roles$ = this.rolesDetailService.assignedRoles$.pipe(map((resource) => new RolesDetailTable(resource)));
    this.rolesTableHasError$ = this.rolesDetailService.hasError$;
    this.isLoadingRoles$ = this.rolesDetailService.isLoadingAssigned$;
    this.onRolesLoadEvent(initialLoadEvent);
  }
}
