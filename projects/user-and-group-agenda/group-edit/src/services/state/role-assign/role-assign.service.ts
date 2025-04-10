import { PaginatedResource, PaginationBaseEvent } from '@sentinel/common/pagination';
import { UserRole } from '@crczp/user-and-group-model';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 * Subscribe to assignedRoles$ to receive latest data updates.
 */
export abstract class RoleAssignService {
    protected hasErrorSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /**
     * True if error was returned from API, false otherwise
     */
    hasError$: Observable<boolean> = this.hasErrorSubject$.asObservable();

    protected isLoadingAssignedSubject$ = new BehaviorSubject<boolean>(false);
    /**
     * True if service is waiting on response from API for request to get assigned users
     */
    isLoadingAssigned$: Observable<boolean> = this.isLoadingAssignedSubject$.asObservable();

    protected selectedRolesToAssignSubject$: BehaviorSubject<UserRole[]> = new BehaviorSubject([]);
    selectedRolesToAssign$: Observable<UserRole[]> = this.selectedRolesToAssignSubject$;

    protected selectedAssignedRolesSubject$: BehaviorSubject<UserRole[]> = new BehaviorSubject([]);
    selectedAssignedRoles$: Observable<UserRole[]> = this.selectedAssignedRolesSubject$.asObservable();

    /**
     * List of roles already assigned to the resource
     */
    abstract assignedRoles$: Observable<PaginatedResource<UserRole>>;

    setSelectedRolesToAssign(roles: UserRole[]): void {
        this.selectedRolesToAssignSubject$.next(roles);
    }

    clearSelectedRolesToAssign(): void {
        this.selectedRolesToAssignSubject$.next([]);
    }

    setSelectedAssignedRoles(roles: UserRole[]): void {
        this.selectedAssignedRolesSubject$.next(roles);
    }

    clearSelectedAssignedRoles(): void {
        this.selectedAssignedRolesSubject$.next([]);
    }

    /**
     * Gets roles available to assign
     * @param filterValue filter to be applied on roles
     * @param resourceId id of a resource of which roles should be excluded from result
     * @returns roles available to assign
     */
    abstract getAvailableToAssign(resourceId: number, filterValue: string): Observable<PaginatedResource<UserRole>>;

    /**
     * Get roles already assigned to the resource
     * @contract MUST update assignedRoles observable.
     * @param resourceId id of a resource associated with roles
     * @param pagination requested pagination
     * @param filterValue filter to be applied on result
     */
    abstract getAssigned(
        resourceId: number,
        pagination: PaginationBaseEvent,
        filterValue?: string,
    ): Observable<PaginatedResource<UserRole>>;

    /**
     * Assigns roles to a resource
     * @param resourceId id of a resource to associate with selected roles
     * @param roles user roles to assign to a resource
     */
    abstract assign(resourceId: number, roles: UserRole[]): Observable<any>;

    /**
     * Assigns selected roles to a resource
     * @param resourceId id of a resource to associate with selected roles
     */
    abstract assignSelected(resourceId: number): Observable<any>;

    /**
     * Unassigns roles from resource
     * @param resourceId id of a resource which association with roles should be cancelled
     * @param roles roles to unassigned from a resource
     */
    abstract unassign(resourceId: number, roles: UserRole[]): Observable<any>;

    /**
     * Unassigns selected roles from resource
     * @param resourceId id of a resource which association with roles should be cancelled
     */
    abstract unassignSelected(resourceId: number): Observable<any>;
}
