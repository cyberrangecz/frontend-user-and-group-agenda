import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Role} from '../../model/role.model';
import {Observable} from 'rxjs';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {map} from 'rxjs/operators';
import {RoleMapperService} from './role-mapper.service';
import {RoleDTO} from '../../model/DTO/role-dto.model';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';

@Injectable()
export class RoleFacadeService {

  constructor(private http: HttpClient,
              private roleMapper: RoleMapperService) {
  }

  getRoles(pagination = null): Observable<Role[]> {
    if (pagination) {
      return this.http.get<RestResourceDTO<RoleDTO>>(environment.userAndGroupRestBasePath + environment.rolesPathExtension,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp => this.roleMapper.mapRoleDTOsWithPaginationToRoles(resp)));
    }
    return this.http.get<RestResourceDTO<RoleDTO>>(environment.userAndGroupRestBasePath + environment.rolesPathExtension)
      .pipe(map(resp => this.roleMapper.mapRoleDTOsWithPaginationToRoles(resp)));  }

  getRolesById(id: number): Observable<Role> {
    return this.http.get<RoleDTO>(`${environment.userAndGroupRestBasePath + environment.rolesPathExtension}/${id}`)
      .pipe(map(resp => this.roleMapper.mapRoleDTOToRole(resp)));
  }
}
