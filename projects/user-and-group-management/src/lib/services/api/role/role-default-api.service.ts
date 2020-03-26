import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {map} from 'rxjs/operators';
import {RoleDTO, UserRole} from 'kypo2-auth';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {ConfigService} from '../../../config/config.service';
import {UserAndGroupConfig} from '../../../config/user-and-group-config';
import {KypoPaginatedResource} from 'kypo-common';
import {KypoRequestedPagination} from 'kypo-common';
import {KypoFilter} from 'kypo-common';
import {KypoParamsMerger} from 'kypo-common';
import {FilterParams} from '../../../model/other/filter-params';
import {RoleMapper} from './role-mapper';
import {RoleApi} from './role-api.service';

/**
 * Default implementation of service abstracting http communication with roles endpoint
 */
@Injectable()
export class RoleDefaultApi extends RoleApi {

  private readonly config: UserAndGroupConfig;
  private readonly rolesPathExtension = 'roles';

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    super();
    this.config = this.configService.config;
  }

  /**
   * Sends http request to get paginated roles
   * @param pagination requested pagination
   * @param filters filters to be applied on roles
   */
  getAll(pagination: KypoRequestedPagination, filters: KypoFilter[] = []): Observable<KypoPaginatedResource<UserRole>> {
    const params = KypoParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filters)]);
    return this.http.get<RestResourceDTO<RoleDTO>>(`${this.config.userAndGroupRestBasePath}${this.rolesPathExtension}`,
      { params: params })
      .pipe(map(resp => RoleMapper.mapRolesDTOtoRoles(resp)));
  }

  /**
   * Sends http request to get role by id
   * @param id id of requested role
   */
  get(id: number): Observable<UserRole> {
    return this.http.get<RoleDTO>(`${this.config.userAndGroupRestBasePath}${this.rolesPathExtension}/${id}`)
      .pipe(map(resp => UserRole.fromDTO(resp)));
  }
}
