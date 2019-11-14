import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {PaginatedResource} from '../../../model/table-adapters/paginated-resource';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserMapperService} from './user-mapper.service';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {UserAndGroupManagementConfig} from '../../../config/user-and-group-management-config';
import {ConfigService} from '../../../config/config.service';
import {User, UserDTO} from 'kypo2-auth';
import {RequestedPagination} from '../../../model/other/requested-pagination';
import {Filter} from '../../../model/filters/filter';
import {ParamsMerger} from '../../../model/other/params-merger';
import {FilterParams} from '../../../model/other/filter-params';

@Injectable()
export class UserFacadeService {
  private readonly config: UserAndGroupManagementConfig;
  private readonly usersPathExtension = 'users/';

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private userMapper: UserMapperService) {
    this.config = this.configService.config;
  }

  getUsers(pagination: RequestedPagination, filter: Filter[] = []): Observable<PaginatedResource<User[]>> {
    const params = ParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filter)]);
    return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension,
      { params: params })
      .pipe(map(resp => this.userMapper.mapUserDTOsToUsers(resp)));
  }

  getUserById(id: number) {
    return this.http.get(`${this.config.userAndGroupRestBasePath + this.usersPathExtension}${id}`);
  }

  deleteUsers(userIds: number[]) {
    return this.http.request('delete', this.config.userAndGroupRestBasePath + this.usersPathExtension,
      {
        body: userIds
      });
  }

  getUsersNotInGroup(groupId: number, pagination: RequestedPagination, filters: Filter[] = []): Observable<PaginatedResource<User[]>> {
    const params = ParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filters)]);
    return this.http.get<RestResourceDTO<UserDTO>>(
      `${this.config.userAndGroupRestBasePath + this.usersPathExtension}not-in-groups/${groupId}`,
      {params: params})
      .pipe(map(resp => this.userMapper.mapUserDTOsToUsers(resp)));
  }

  getUsersInGroups(groupIds: number[], pagination: RequestedPagination, filters: Filter[] = []) {
    const idParams = new HttpParams().set('ids', groupIds.toString());
    const params = ParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filters), idParams]);
    return this.http.get<RestResourceDTO<UserDTO>>(
      `${this.config.userAndGroupRestBasePath + this.usersPathExtension}groups`,
      {params: params})
      .pipe(map(resp => this.userMapper.mapUserDTOsToUsers(resp)));
  }
}
