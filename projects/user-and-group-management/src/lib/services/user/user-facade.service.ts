import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';
import {TableDataWrapper} from '../../model/table-data/table-data-wrapper';
import {Observable} from 'rxjs';
import {UserTableDataModel} from '../../model/table-data/user-table-data.model';
import {User} from '../../model/user/user.model';
import {UserDTO} from '../../model/DTO/user/user-dto.model';
import {map} from 'rxjs/operators';
import {UserMapperService} from './user-mapper.service';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';
import {ConfigService} from '../../config/config.service';

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

  getUsersTableData(pagination = null): Observable<TableDataWrapper<UserTableDataModel[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension,
        { params: PaginationHttpParams.createPaginationParams(pagination) })
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTableDataModel(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(this.config.userAndGroupRestBasePath + this.usersPathExtension)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTableDataModel(resp)));
  }

  getUsers(pagination = null): Observable<TableDataWrapper<User[]>> {
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

  getUserRoles(userId: number) {
    return this.http.get(`${this.config.userAndGroupRestBasePath
    + this.usersPathExtension}/${userId}/${this.rolesPathExtension}`);
  }

  getLoggedUserInfo() {
    return this.http.get(`${this.config.userAndGroupRestBasePath + this.usersPathExtension}info`);
  }

  getUsersNotInGroup(groupId: number, pagination = null): Observable<TableDataWrapper<User[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(
        `${this.config.userAndGroupRestBasePath + this.usersPathExtension}not-in-groups/${groupId}`,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(
      `${this.config.userAndGroupRestBasePath + this.usersPathExtension}not-in-groups/${groupId}`)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
  }

  updateUser(user: User) {
  }

  createUser(user: User) {

  }
}
