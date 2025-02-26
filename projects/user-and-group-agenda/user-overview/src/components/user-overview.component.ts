import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { OffsetPaginationEvent } from '@sentinel/common/pagination';
import { SentinelControlItem } from '@sentinel/components/controls';
import { User } from '@crczp/user-and-group-model';
import { SentinelTable, TableActionEvent, TableLoadEvent } from '@sentinel/components/table';
import { defer, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserTable } from '../model/user-table';
import { DeleteControlItem, PaginationService } from '@crczp/user-and-group-agenda/internal';
import { UserOverviewService } from '../services/overview/user-overview.service';
import { UserAndGroupNavigator } from '@crczp/user-and-group-agenda';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Main smart component of user overview page
 */
@Component({
    selector: 'crczp-user-overview',
    templateUrl: './user-overview.component.html',
    styleUrls: ['./user-overview.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOverviewComponent implements OnInit {
    @Input() paginationId = 'crczp-user-overview';
    readonly INIT_SORT_NAME = 'familyName';
    readonly INIT_SORT_DIR = 'asc';
    destroyRef = inject(DestroyRef);

    /**
     * Data for users table
     */
    users$: Observable<SentinelTable<User>>;
    /**
     * True, if data requested for table has error, false otherwise
     */
    usersHasError$: Observable<boolean>;

    controls: SentinelControlItem[];

    constructor(
        private userService: UserOverviewService,
        private paginationService: PaginationService,
        private navigator: UserAndGroupNavigator,
    ) {}

    ngOnInit(): void {
        const initialLoadEvent: TableLoadEvent = {
            pagination: new OffsetPaginationEvent(
                0,
                this.paginationService.getPagination(this.paginationId),
                this.INIT_SORT_NAME,
                this.INIT_SORT_DIR,
            ),
        };
        this.users$ = this.userService.resource$.pipe(
            map((groups) => new UserTable(groups, this.userService, this.navigator)),
        );
        this.usersHasError$ = this.userService.hasError$;
        this.onLoadEvent(initialLoadEvent);
        this.userService.selected$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((ids) => this.initControls(ids.length));
    }

    /**
     * Clears selected users and calls service to get new data for table component
     * @param event load table vent emitted by table component
     */
    onLoadEvent(event: TableLoadEvent): void {
        this.paginationService.setPagination(this.paginationId, event.pagination.size);
        this.userService.getAll(event.pagination, event.filter).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }

    /**
     * Resolves type of action and call appropriate handler
     * @param event action event emitted by table component
     */
    onTableAction(event: TableActionEvent<User>): void {
        event.action.result$.pipe(take(1)).subscribe();
    }

    onControlsAction(controlItem: SentinelControlItem): void {
        controlItem.result$.pipe(take(1)).subscribe();
    }

    /**
     * Changes internal state of the component, stores ids of users selected in table component
     * @param selected users selected in table component
     */
    onUserSelected(selected: User[]): void {
        this.userService.setSelection(selected);
    }

    private initControls(selectedUsersLength: number) {
        this.controls = [
            new DeleteControlItem(
                selectedUsersLength,
                defer(() => this.userService.deleteSelected()),
            ),
            new SentinelControlItem(
                'download_oidc_users',
                'Get Users Credentials',
                'primary',
                of(false),
                defer(() => this.userService.getLocalOIDCUsers()),
            ),
            new SentinelControlItem(
                'import_users',
                'Import Users',
                'primary',
                of(false),
                defer(() => this.userService.importUsers()),
            ),
        ];
    }
}
