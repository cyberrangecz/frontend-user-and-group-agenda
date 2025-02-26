import { Injectable } from '@angular/core';
import { GroupApi, RoleApi } from '@crczp/user-and-group-api';
import { UserRole } from '@crczp/user-and-group-model';
import { SentinelFilter } from '@sentinel/common/filter';
import { OffsetPagination, OffsetPaginationEvent, PaginatedResource } from '@sentinel/common/pagination';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAndGroupErrorHandler } from '@crczp/user-and-group-agenda';
import { RolesDetailService } from './roles-detail.service';
import { tap } from 'rxjs/operators';

/**
 * Basic implementation of a layer between a component and an API service.
 * Can manually get users assigned to resource and users/groups available to assign and perform assignment modifications.
 */
@Injectable()
export class RolesDetailConcreteService extends RolesDetailService {
    private lastPagination: OffsetPaginationEvent;
    private lastFilter: string;

    constructor(
        private api: GroupApi,
        private roleApi: RoleApi,
        private errorHandler: UserAndGroupErrorHandler,
    ) {
        super();
    }

    private assignedRolesSubject$: BehaviorSubject<PaginatedResource<UserRole>> = new BehaviorSubject(
        this.initSubject(),
    );
    /**
     * Subscribe to receive assigned roles
     */
    assignedRoles$: Observable<PaginatedResource<UserRole>> = this.assignedRolesSubject$.asObservable();

    /**
     * Gets roles assigned to a resource, updates related observables or handles error
     * @param resourceId id of a resource associated with requested roles
     * @param pagination requested pagination
     * @param filterValue filter to be applied on result
     */
    getAssigned(
        resourceId: number,
        pagination: OffsetPaginationEvent,
        filterValue: string = null,
    ): Observable<PaginatedResource<UserRole>> {
        this.lastPagination = pagination;
        this.lastFilter = filterValue;
        const filter = filterValue ? [new SentinelFilter('roleType', filterValue)] : [];
        this.hasErrorSubject$.next(false);
        this.isLoadingAssignedSubject$.next(true);
        return this.api.getRolesOfGroup(resourceId, pagination, filter).pipe(
            tap(
                (roles) => {
                    this.assignedRolesSubject$.next(roles);
                    this.isLoadingAssignedSubject$.next(false);
                },
                (err) => {
                    this.errorHandler.emit(err, 'Fetching roles of group-overview');
                    this.isLoadingAssignedSubject$.next(false);
                    this.hasErrorSubject$.next(true);
                },
            ),
        );
    }

    private initSubject(): PaginatedResource<UserRole> {
        return new PaginatedResource([], new OffsetPagination(0, 0, 10, 0, 0));
    }
}
