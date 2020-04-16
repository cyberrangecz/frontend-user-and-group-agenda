import { KypoFilter, KypoPaginatedResource, KypoRequestedPagination } from 'kypo-common';
import { Observable } from 'rxjs';
import { UserRole, User } from 'kypo2-auth';

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

  /**
   * Sends http request to get all users wit given role id
   * @param id id of requested role
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  abstract getUsersForRole(id: number, pagination: KypoRequestedPagination, filters?: KypoFilter[]): Observable<KypoPaginatedResource<User>>;

  /**
   * Sends http request to get all users wit given role type
   * @param type type of requested role
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  abstract getUsersForRoleType(type: string, pagination: KypoRequestedPagination, filters?: KypoFilter[]): Observable<KypoPaginatedResource<User>>;

  /**
   * Sends http request to get all users wit given role type and not with given id
   * @param type type of requested role
   * @param ids ids of users to be excluded from result
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  abstract getUsersNotWithIds(type: string, ids: number[], pagination: KypoRequestedPagination, filters?: KypoFilter[]): Observable<KypoPaginatedResource<User>>;

}
