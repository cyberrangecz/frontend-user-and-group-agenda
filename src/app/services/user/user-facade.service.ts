import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';
import {TableDataWrapper} from '../../model/table-data/table-data-wrapper';
import {Observable} from 'rxjs';
import {UserTableDataModel} from '../../model/table-data/user-table-data.model';
import {User} from '../../model/user/user.model';

@Injectable()
export class UserFacadeService {

  constructor(private http: HttpClient) {
  }

  getUsers(pagination = null): Observable<TableDataWrapper<UserTableDataModel[]>> {
    if (pagination) {
      return this.http.get<TableDataWrapper<UserTableDataModel[]>>(environment.userAndGroupRestBasePath + environment.usersPathExtension,
        { params: PaginationHttpParams.createPaginationParams(pagination) });
    }
    return this.http.get<TableDataWrapper<UserTableDataModel[]>>(environment.userAndGroupRestBasePath + environment.usersPathExtension);
  }

  getUserById(id: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.usersPathExtension}/${id}`);
  }

  deleteUsers(userIds: number[]) {
    return this.http.request('delete', environment.userAndGroupRestBasePath + environment.usersPathExtension,
      {
        body: {
          ids: userIds
        }
      });
  }

  deleteUser(userId: number) {
    return this.http.request('delete', `${environment.userAndGroupRestBasePath + environment.usersPathExtension}/${userId}`);
  }

  getUserRoles(userId: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath
    + environment.usersPathExtension}/${userId}${environment.rolesPathExtension}`);
  }

  getLoggedUserInfo() {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.usersPathExtension}/info`);
  }

  getUsersNotInGroup(groupId: number, pagination = null) {
    if (pagination) {

    }
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.usersPathExtension}/not-in-groups/${groupId}`);
  }

  updateUser(user: User) {

  }

  createUser(user: User) {

  }
}
