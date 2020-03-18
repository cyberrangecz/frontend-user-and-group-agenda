import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {KypoPaginatedResource} from 'kypo-common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserMapperService} from './user-mapper.service';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {UserAndGroupConfig} from '../../../config/user-and-group-config';
import {ConfigService} from '../../../config/config.service';
import {User, UserDTO} from 'kypo2-auth';
import {KypoRequestedPagination} from 'kypo-common';
import {KypoFilter} from 'kypo-common';
import {KypoParamsMerger} from 'kypo-common';
import {FilterParams} from '../../../model/other/filter-params';

/**
 * Service abstracting http communication with user endpoints
 */
@Injectable()
export class UserApi {
  private readonly config: UserAndGroupConfig;
  private readonly usersPathExtension = 'users/';

  constructor(private http: HttpClient,
              private configService: ConfigService,
              private userMapper: UserMapperService) {
    this.config = this.configService.config;
  }

  /**
   * Sends http request to get paginated users
   * @param pagination requested pagination
   * @param filter filter to be applied on users
   */
  getAll(pagination: KypoRequestedPagination, filter: KypoFilter[] = []): Observable<KypoPaginatedResource<User>> {
    const params = KypoParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filter)]);
    return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension,
      { params: params })
      .pipe(map(resp => this.userMapper.mapUserDTOsToUsers(resp)));
  }

  /**
   * Sends http request to get user by id
   * @param id id of requested user
   */
  get(id: number) {
    return this.http.get(`${this.config.userAndGroupRestBasePath + this.usersPathExtension}${id}`);
  }

  /**
   * Sends http request to delete multiple users
   * @param userIds ids of users to delete
   */
  deleteMultiple(userIds: number[]) {
    return this.http.request('delete', this.config.userAndGroupRestBasePath + this.usersPathExtension,
      {
        body: userIds
      });
  }

  /**
   * Sends http request to get users that are not members of provided group
   * @param groupId id of a group that has no association with requested users
   * @param pagination requested pagination
   * @param filters filters to be applied on users
   */
  getUsersNotInGroup(groupId: number, pagination: KypoRequestedPagination, filters: KypoFilter[] = []): Observable<KypoPaginatedResource<User>> {
    const params = KypoParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filters)]);
    return this.http.get<RestResourceDTO<UserDTO>>(
      `${this.config.userAndGroupRestBasePath + this.usersPathExtension}not-in-groups/${groupId}`,
      {params: params})
      .pipe(map(resp => this.userMapper.mapUserDTOsToUsers(resp)));
  }

  /**
   * Sends http request to get users that are members of provided groups
   * @param groupIds ids of a groups that are associated with requested users
   * @param pagination requested pagination
   * @param filters filters to be applied on users
   */
  getUsersInGroups(groupIds: number[], pagination: KypoRequestedPagination, filters: KypoFilter[] = []) {
    const idParams = new HttpParams().set('ids', groupIds.toString());
    const params = KypoParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filters), idParams]);
    return this.http.get<RestResourceDTO<UserDTO>>(
      `${this.config.userAndGroupRestBasePath + this.usersPathExtension}groups`,
      {params: params})
      .pipe(map(resp => this.userMapper.mapUserDTOsToUsers(resp)));
  }
}
