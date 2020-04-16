import { KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { User } from 'kypo2-auth';
import { Observable } from 'rxjs';
import { SelectablePaginatedService } from '../shared/selectable-paginated.service';
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
  abstract getAll(pagination?: KypoRequestedPagination, filter?: string): Observable<KypoPaginatedResource<User>>;

  /**
   * Deletes user
   * @param user a user to be deleted
   */
  abstract delete(user: User): Observable<any>;

  /**
   * Deletes selected users
   */
  abstract deleteSelected(): Observable<any>;
}
