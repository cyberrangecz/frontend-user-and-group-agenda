import { PaginatedResource, PaginationBaseEvent } from '@sentinel/common/pagination';
import { User } from '@crczp/user-and-group-model';
import { Observable } from 'rxjs';
import { SelectablePaginatedService } from '@crczp/user-and-group-agenda/internal';

/**
 * A layer between a component and an API service. Implement a concrete service by extending this class.
 * Provide a concrete class in Angular Module. For more info see https://angular.io/guide/dependency-injection-providers.
 * You can use get methods to get paginated requests and other operations to modify data.
 */
export abstract class UserOverviewService extends SelectablePaginatedService<User> {
    protected constructor(pageSize: number) {
        super(pageSize);
    }

    /**
     * @param pagination requested pagination
     * @param filter filer to be applied on resource
     */
    abstract getAll(pagination?: PaginationBaseEvent, filter?: string): Observable<PaginatedResource<User>>;

    /**
     * Gets user with given user id
     * @param userId user id
     */
    abstract get(userId: number): Observable<User>;

    /**
     * Deletes user
     * @param user a user to be deleted
     */
    abstract delete(user: User): Observable<any>;

    /**
     * Deletes selected users
     */
    abstract deleteSelected(): Observable<any>;

    /**
     * Gets OIDC users info
     */
    abstract getLocalOIDCUsers(): Observable<boolean>;

    /**
     * Import users
     */
    abstract importUsers(): Observable<any>;
}
