import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Role} from '../../model/role/role.model';
import {Observable} from 'rxjs';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {map} from 'rxjs/operators';
import {RoleMapperService} from './role-mapper.service';
import {RoleDTO} from '../../model/DTO/role-dto.model';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';
import {ConfigService} from '../../config/config.service';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';

@Injectable()
export class RoleFacadeService {
  private readonly config: UserAndGroupManagementConfig;

  private readonly rolesPathExtension = 'roles/';

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private roleMapper: RoleMapperService) {
    this.config = this.configService.config;
  }

  getRoles(pagination = null): Observable<Role[]> {
    if (pagination) {
      return this.http.get<RestResourceDTO<RoleDTO>>(this.config.userAndGroupRestBasePath + this.rolesPathExtension,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp => this.roleMapper.mapRoleDTOsWithPaginationToRoles(resp)));
    }
    return this.http.get<RestResourceDTO<RoleDTO>>(this.config.userAndGroupRestBasePath + this.rolesPathExtension)
      .pipe(map(resp => this.roleMapper.mapRoleDTOsWithPaginationToRoles(resp)));  }

  getRolesById(id: number): Observable<Role> {
    return this.http.get<RoleDTO>(`${this.config.userAndGroupRestBasePath + this.rolesPathExtension}/${id}`)
      .pipe(map(resp => this.roleMapper.mapRoleDTOToRole(resp)));
  }
}
