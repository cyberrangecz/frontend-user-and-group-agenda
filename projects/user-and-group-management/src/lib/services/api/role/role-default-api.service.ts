import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KypoRequestedPagination } from 'kypo-common';
import { KypoPaginatedResource } from 'kypo-common';
import { KypoFilter } from 'kypo-common';
import { KypoParamsMerger } from 'kypo-common';
import { RoleDTO, User, UserDTO, UserRole } from 'kypo2-auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAndGroupConfig } from '../../../model/client/user-and-group-config';
import { RestResourceDTO } from '../../../model/DTO/rest-resource-dto.model';
import { RoleMapper } from '../../../model/mappers/role-mapper';
import { FilterParams } from '../../../model/other/filter-params';
import { PaginationHttpParams } from '../../../model/other/pagination-http-params';
import { UserAndGroupContext } from '../../shared/user-and-group-context.service';
import { UserMapper } from './../../../model/mappers/user.mapper';
import { RoleApi } from './role-api.service';

/**
 * Default implementation of service abstracting http communication with roles endpoint
 */
@Injectable()
export class RoleDefaultApi extends RoleApi {
  private readonly config: UserAndGroupConfig;
  private readonly rolesPathExtension = 'roles';

  constructor(private http: HttpClient, private configService: UserAndGroupContext) {
    super();
    this.config = this.configService.config;
  }

  /**
   * Sends http request to get paginated roles
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  getAll(pagination: KypoRequestedPagination, filters: KypoFilter[] = []): Observable<KypoPaginatedResource<UserRole>> {
    const params = KypoParamsMerger.merge([
      PaginationHttpParams.createPaginationParams(pagination),
      FilterParams.create(filters),
    ]);
    return this.http
      .get<RestResourceDTO<RoleDTO>>(`${this.config.userAndGroupRestBasePath}${this.rolesPathExtension}`, { params })
      .pipe(map((resp) => RoleMapper.mapRolesDTOtoRoles(resp)));
  }

  /**
   * Sends http request to get role by id
   * @param id id of requested role
   */
  get(id: number): Observable<UserRole> {
    return this.http
      .get<RoleDTO>(`${this.config.userAndGroupRestBasePath}${this.rolesPathExtension}/${id}`)
      .pipe(map((resp) => UserRole.fromDTO(resp)));
  }

  /**
   * Sends http request to get all users wit given role id
   * @param id id of requested role
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  getUsersForRole(
    id: number,
    pagination: KypoRequestedPagination,
    filters?: KypoFilter[]
  ): Observable<KypoPaginatedResource<User>> {
    const params = KypoParamsMerger.merge([
      PaginationHttpParams.createPaginationParams(pagination),
      FilterParams.create(filters),
    ]);
    return this.http
      .get<RestResourceDTO<UserDTO>>(`${this.config.userAndGroupRestBasePath}${this.rolesPathExtension}/${id}/users`, {
        params,
      })
      .pipe(map((resp) => UserMapper.mapUserDTOsToUsers(resp)));
  }

  /**
   * Sends http request to get all users wit given role type
   * @param type type of requested role
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  getUsersForRoleType(
    type: string,
    pagination: KypoRequestedPagination,
    filters?: KypoFilter[]
  ): Observable<KypoPaginatedResource<User>> {
    const typeParam = new HttpParams().set('roleType', type);
    const params = KypoParamsMerger.merge([
      PaginationHttpParams.createPaginationParams(pagination),
      FilterParams.create(filters),
      typeParam,
    ]);
    return this.http
      .get<RestResourceDTO<UserDTO>>(`${this.config.userAndGroupRestBasePath}${this.rolesPathExtension}/users`, {
        params,
      })
      .pipe(map((resp) => UserMapper.mapUserDTOsToUsers(resp)));
  }

  /**
   * Sends http request to get all users wit given role type and not with given id
   * @param type type of requested role
   * @param ids ids of users to be excluded from result
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  getUsersNotWithIds(
    type: string,
    ids: number[],
    pagination: KypoRequestedPagination,
    filters?: KypoFilter[]
  ): Observable<KypoPaginatedResource<User>> {
    const idParams = new HttpParams().set('ids', ids.toString());
    const typeParam = new HttpParams().set('roleType', type);
    const params = KypoParamsMerger.merge([
      PaginationHttpParams.createPaginationParams(pagination),
      FilterParams.create(filters),
      idParams,
      typeParam,
    ]);
    return this.http
      .get<RestResourceDTO<UserDTO>>(
        `${this.config.userAndGroupRestBasePath}${this.rolesPathExtension}/users-not-with-ids`,
        { params }
      )
      .pipe(map((resp) => UserMapper.mapUserDTOsToUsers(resp)));
  }
}
