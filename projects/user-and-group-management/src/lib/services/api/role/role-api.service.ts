import {KypoFilter, KypoPaginatedResource, KypoRequestedPagination} from 'kypo-common';
import {Observable} from 'rxjs';
import {UserRole} from 'kypo2-auth';

/**
 * Abstraction of http communication with roles endpoint
 */
export abstract class RoleApi {

  /**
   * Sends http request to get paginated roles
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  abstract getAll(pagination: KypoRequestedPagination, filters?: KypoFilter[]): Observable<KypoPaginatedResource<UserRole>>;

  /**
   * Sends http request to get role by id
   * @param id id of requested role
   */
  abstract get(id: number): Observable<UserRole>;
}
