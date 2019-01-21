import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Group} from '../../model/group/group.model';
import {AddUsersToGroupDTO} from '../../model/DTO/user/add-user-to-group-dto.model';

@Injectable()
export class GroupFacadeService {

  constructor(private http: HttpClient) {
  }

  getGroups(pagination = null) {
    if (pagination) {

    }
    return this.http.get(environment.userAndGroupRestBasePath + environment.groupsPathExtension);
  }

  getGroupById(groupId: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}/${groupId}`);
  }

  createGroup(group: Group) {
    return this.http.post(environment.userAndGroupRestBasePath + environment.groupsPathExtension,
      group);
  }

  updateGroup(group: Group) {
    return this.http.put(environment.userAndGroupRestBasePath + environment.groupsPathExtension,
      group);
  }

  deleteGroups(groupIds: number[]) {
    return this.http.request('delete',
      environment.userAndGroupRestBasePath + environment.groupsPathExtension,
      {
        body: {
          ids: groupIds
        }
      });
  }

  deleteGroup(groupId: number) {
    return this.http.delete(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}/${groupId}`);
  }

  assignRoleToGroupInMicroservice(groupId: number, roleId: number, microserviceId: number) {
    return this.http.put(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    /${groupId}/assign/${roleId}/in-microservices/${microserviceId}`, {});
  }

  removeRoleFromGroupInMicroservice(groupId: number, roleId: number, microserviceId: number) {
    return this.http.put(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    /${groupId}/remove/${roleId}/in-microservices/${microserviceId}`, {});
  }

  getRolesOfGroup(groupId: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    /${groupId}${environment.rolesPathExtension}`);
  }

  removeUsersFromGroup(groupId: number, userIds: number[]) {
    return this.http.put(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    /${groupId}${environment.usersPathExtension}`,
      {
        userIds: userIds
      });
  }

  addUsersToGroup(groupId: number, userIds: number[]) {
    const addUsersDTO = new AddUsersToGroupDTO();
    addUsersDTO.group_id = groupId;
    addUsersDTO.ids_of_users_to_be_add = userIds;
    addUsersDTO.ids_of_groups_of_imported_users = []; // TODO Find out what this means
    return this.http.put(environment.userAndGroupRestBasePath + environment.groupsPathExtension + environment.usersPathExtension,
      { addUsers: addUsersDTO});
  }
}
