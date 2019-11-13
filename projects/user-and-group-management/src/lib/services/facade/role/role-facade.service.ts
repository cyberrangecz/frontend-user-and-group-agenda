import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {map} from 'rxjs/operators';
import {RoleDTO, UserRole} from 'kypo2-auth';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {ConfigService} from '../../../config/config.service';
import {UserAndGroupManagementConfig} from '../../../config/user-and-group-management-config';
import {PaginatedResource} from '../../../model/table-adapters/paginated-resource';
import {Pagination} from '../../../model/table-adapters/pagination';
import {RequestedPagination} from '../../../model/other/requested-pagination';
import {Filter} from '../../../model/filters/filter';
import {ParamsMerger} from '../../../model/other/params-merger';
import {FilterParams} from '../../../model/other/filter-params';

@Injectable()
export class RoleFacadeService {
  private readonly config: UserAndGroupManagementConfig;

  private readonly rolesPathExtension = 'roles/';

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.config = this.configService.config;
  }

  getRoles(pagination: RequestedPagination, filters: Filter[] = []): Observable<PaginatedResource<UserRole[]>> {
    const params = ParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filters)]);
    return this.http.get<RestResourceDTO<RoleDTO>>(this.config.userAndGroupRestBasePath + this.rolesPathExtension,
      { params: params })
      .pipe(map(resp => this.mapRolesDTOtoRoles(resp)));
  }

  getRoleById(id: number): Observable<UserRole> {
    return this.http.get<RoleDTO>(`${this.config.userAndGroupRestBasePath + this.rolesPathExtension}/${id}`)
      .pipe(map(resp => UserRole.fromDTO(resp)));
  }

  private mapRolesDTOtoRoles(resource: RestResourceDTO<RoleDTO>): PaginatedResource<UserRole[]> {
    const content = resource.content.map(dto => UserRole.fromDTO(dto));

    // TODO: Replace once pagination is fixed
    /*    const pagination = new Pagination(
      resource.pagination.number,
      resource.pagination.number_of_elements,
      resource.pagination.size,
      resource.pagination.total_elements,
      resource.pagination.total_pages
    );*/
    const pagination = new Pagination(0, 0, 0, 0, 0);
    return new PaginatedResource(content, pagination);
  }
}
