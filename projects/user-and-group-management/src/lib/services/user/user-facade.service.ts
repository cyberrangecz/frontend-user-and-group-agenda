import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';
import {TableAdapter} from '../../model/table-data/table-adapter';
import {Observable} from 'rxjs';
import {UserTableRow} from '../../model/table-data/user-table-row';
import {map} from 'rxjs/operators';
import {UserMapperService} from './user-mapper.service';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';
import {ConfigService} from '../../config/config.service';
import {User, UserDTO} from 'kypo2-auth';

@Injectable()
export class UserFacadeService {
  private readonly config: UserAndGroupManagementConfig;
  private readonly usersPathExtension = 'users/';
  private readonly rolesPathExtension = 'roles/';


  constructor(private http: HttpClient,
              private configService: ConfigService,
              private userMapper: UserMapperService) {
    this.config = this.configService.config;
  }

  getUsersTable(pagination = null): Observable<TableAdapter<UserTableRow[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension,
        { params: PaginationHttpParams.createPaginationParams(pagination) })
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTable(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTable(resp)));
  }

  getUsers(pagination = null): Observable<TableAdapter<User[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
  }

  getUserById(id: number) {
    return this.http.get(`${this.config.userAndGroupRestBasePath + this.usersPathExtension}${id}`);
  }

  removeUsers(userIds: number[]) {
    return this.http.request('delete', this.config.userAndGroupRestBasePath + this.usersPathExtension,
      {
        body: {
          ids: userIds
        }
      });
  }

  removeUser(userId: number) {
    return this.http.request('delete', `${this.config.userAndGroupRestBasePath + this.usersPathExtension}${userId}`);
  }

  getUsersNotInGroup(groupId: number, pagination = null): Observable<TableAdapter<UserTableRow[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(
        `${this.config.userAndGroupRestBasePath + this.usersPathExtension}not-in-groups/${groupId}`,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTable(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(
      `${this.config.userAndGroupRestBasePath + this.usersPathExtension}not-in-groups/${groupId}`)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTable(resp)));
  }
}
