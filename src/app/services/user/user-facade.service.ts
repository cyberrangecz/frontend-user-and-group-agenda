import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';
import {TableDataWrapper} from '../../model/table-data/table-data-wrapper';
import {Observable} from 'rxjs';
import {UserTableDataModel} from '../../model/table-data/user-table-data.model';
import {User} from '../../model/user/user.model';
import {UserDTO} from '../../model/DTO/user/user-dto.model';
import {map} from 'rxjs/operators';
import {UserMapperService} from './user-mapper.service';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';

@Injectable()
export class UserFacadeService {

  constructor(private http: HttpClient,
              private userMapper: UserMapperService) {
  }

  getUsersTableData(pagination = null): Observable<TableDataWrapper<UserTableDataModel[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(environment.userAndGroupRestBasePath + environment.usersPathExtension,
        { params: PaginationHttpParams.createPaginationParams(pagination) })
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTableDataModel(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(environment.userAndGroupRestBasePath + environment.usersPathExtension)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUserTableDataModel(resp)));
  }

  getUsers(pagination = null): Observable<TableDataWrapper<User[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(environment.userAndGroupRestBasePath + environment.usersPathExtension,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(environment.userAndGroupRestBasePath + environment.usersPathExtension)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
  }

  getUserById(id: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.usersPathExtension}${id}`);
  }

  removeUsers(userIds: number[]) {
    return this.http.request('delete', environment.userAndGroupRestBasePath + environment.usersPathExtension,
      {
        body: {
          ids: userIds
        }
      });
  }

  removeUser(userId: number) {
    return this.http.request('delete', `${environment.userAndGroupRestBasePath + environment.usersPathExtension}${userId}`);
  }

  getUserRoles(userId: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath
    + environment.usersPathExtension}/${userId}${environment.rolesPathExtension}`);
  }

  getLoggedUserInfo() {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.usersPathExtension}info`);
  }

  getUsersNotInGroup(groupId: number, pagination = null): Observable<TableDataWrapper<User[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<UserDTO>>(
        `${environment.userAndGroupRestBasePath + environment.usersPathExtension}not-in-groups/${groupId}`,
        {params: PaginationHttpParams.createPaginationParams(pagination)})
        .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
    }
    return this.http.get<RestResourceDTO<UserDTO>>(
      `${environment.userAndGroupRestBasePath + environment.usersPathExtension}not-in-groups/${groupId}`)
      .pipe(map(resp => this.userMapper.mapUserDTOsWithPaginationToUsers(resp)));
  }

  updateUser(user: User) {
  }

  createUser(user: User) {

  }
}
