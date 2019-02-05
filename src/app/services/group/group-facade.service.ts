import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Group} from '../../model/group/group.model';
import {AddUsersToGroupDTO} from '../../model/DTO/user/add-user-to-group-dto.model';
import {TableDataWrapper} from '../../model/table-data/table-data-wrapper';
import {GroupTableDataModel} from '../../model/table-data/group-table-data.model';
import {Observable} from 'rxjs';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {GroupDTO} from '../../model/DTO/group/group-dto.model';
import {map} from 'rxjs/operators';
import {GroupMapperService} from './group-mapper.service';
import {UserMapperService} from '../user/user-mapper.service';

@Injectable()
export class GroupFacadeService {

  constructor(private http: HttpClient,
              private userMapper: UserMapperService,
              private groupMapper: GroupMapperService) {
  }

  getGroups(pagination = null): Observable<TableDataWrapper<GroupTableDataModel[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<GroupDTO>>(environment.userAndGroupRestBasePath + environment.groupsPathExtension,
        { params: PaginationHttpParams.createPaginationParams(pagination) })
        .pipe(map(resp => this.groupMapper.mapGroupDTOsWithPaginationToTableDataWrapper(resp)));
    }
    return this.http.get<TableDataWrapper<GroupTableDataModel[]>>(environment.userAndGroupRestBasePath + environment.groupsPathExtension);
  }

  getGroupById(groupId: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}${groupId}`);
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
    return this.http.delete(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}${groupId}`);
  }

  assignRoleToGroupInMicroservice(groupId: number, roleId: number, microserviceId: number) {
    return this.http.put(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    ${groupId}/assign/${roleId}/in-microservices/${microserviceId}`, {});
  }

  removeRoleFromGroupInMicroservice(groupId: number, roleId: number, microserviceId: number) {
    return this.http.put(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    ${groupId}/remove/${roleId}/in-microservices/${microserviceId}`, {});
  }

  getRolesOfGroup(groupId: number) {
    return this.http.get(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    ${groupId}/${environment.rolesPathExtension}`);
  }

  removeUsersFromGroup(groupId: number, userIds: number[]) {
    return this.http.put(`${environment.userAndGroupRestBasePath + environment.groupsPathExtension}
    ${groupId}/${environment.usersPathExtension}`,
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
