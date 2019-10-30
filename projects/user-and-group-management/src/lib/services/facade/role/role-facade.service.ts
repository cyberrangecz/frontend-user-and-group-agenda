import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {map} from 'rxjs/operators';
import {RoleDTO, UserRole} from 'kypo2-auth';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {ConfigService} from '../../../config/config.service';
import {UserAndGroupManagementConfig} from '../../../config/user-and-group-management-config';

@Injectable()
export class RoleFacadeService {
  private readonly config: UserAndGroupManagementConfig;

  private readonly rolesPathExtension = 'roles/';

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.config = this.configService.config;
  }

  getRoles(pagination = null): Observable<UserRole[]> {
    if (pagination) {
      return this.http.get<RestResourceDTO<RoleDTO>>(this.config.userAndGroupRestBasePath + this.rolesPathExtension,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp =>
          resp.content.map(dto => UserRole.fromDTO(dto))));
    }
    return this.http.get<RestResourceDTO<RoleDTO>>(this.config.userAndGroupRestBasePath + this.rolesPathExtension)
      .pipe(map(resp =>
        resp.content.map(dto => UserRole.fromDTO(dto))));
  }

  getRoleById(id: number): Observable<UserRole> {
    return this.http.get<RoleDTO>(`${this.config.userAndGroupRestBasePath + this.rolesPathExtension}/${id}`)
      .pipe(map(resp => UserRole.fromDTO(resp)));
  }
}
