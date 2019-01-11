import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {group} from '@angular/animations';

@Injectable()
export class UserFacadeService {

  constructor(private http: HttpClient) {
  }

  getUsers(pagination = null) {
    if (pagination) {

    }
    return this.http.get(environment.userAndGroupRestBasePath + environment.usersPathExtension);
  }

  deleteUsers(userIds: number[]) {
    return this.http.request('delete', environment.userAndGroupRestBasePath + environment.usersPathExtension,
      {
        body: userIds
      });
  }

  getUserById(id: number) {
   return this.http.get(`${environment.userAndGroupRestBasePath + environment.usersPathExtension}/${id}`);
  }

  deleteUserById(userId: number) {
    return this.http.request('delete', environment.userAndGroupRestBasePath + environment.usersPathExtension,
      {
        body: userId
      });
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
}
