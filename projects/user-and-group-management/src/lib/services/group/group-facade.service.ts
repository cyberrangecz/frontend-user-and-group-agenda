import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from '../../model/group/group.model';
import {TableDataWrapper} from '../../model/table-data/table-data-wrapper';
import {GroupTableDataModel} from '../../model/table-data/group-table-data.model';
import {Observable} from 'rxjs';
import {PaginationHttpParams} from '../../model/other/pagination-http-params';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {GroupDTO} from '../../model/DTO/group/group-dto.model';
import {map} from 'rxjs/operators';
import {GroupMapperService} from './group-mapper.service';
import {UserMapperService} from '../user/user-mapper.service';
import {ConfigService} from '../../config/config.service';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';

@Injectable()
export class GroupFacadeService {

  private readonly config: UserAndGroupManagementConfig;
  private readonly groupsPathExtension = 'groups/';
  private readonly usersPathExtension = 'users/';
  private readonly rolesPathExtension = 'roles/';


  constructor(private http: HttpClient,
              private configService: ConfigService,
              private userMapper: UserMapperService,
              private groupMapper: GroupMapperService) {
    this.config = this.configService.config;
  }

  getGroups(pagination = null): Observable<TableDataWrapper<GroupTableDataModel[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<GroupDTO>>(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
        { params: PaginationHttpParams.createPaginationParams(pagination) })
        .pipe(map(resp => this.groupMapper.mapGroupDTOsWithPaginationToTableDataWrapper(resp)));
    }
    return this.http.get<TableDataWrapper<GroupTableDataModel[]>>(this.config.userAndGroupRestBasePath + this.groupsPathExtension);
  }

  getGroupById(groupId: number) {
    return this.http.get(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}${groupId}`);
  }

  createGroup(group: Group) {
    return this.http.post(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      this.groupMapper.mapGroupToNewGroupDTO(group));
  }

  updateGroup(group: Group) {
    return this.http.put(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      this.groupMapper.mapGroupToUpdateGroupDTO(group));
  }

  deleteGroups(groupIds: number[]) {
    return this.http.request('delete',
      this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      {
        body: {
          ids: groupIds
        }
      });
  }

  deleteGroup(groupId: number) {
    return this.http.delete(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}${groupId}`);
  }

  assignRoleToGroupInMicroservice(groupId: number, roleId: number, microserviceId: number): Observable<any> {
    return this.http.put(this.config.userAndGroupRestBasePath + this.groupsPathExtension
    + groupId + '/roles/' + roleId + '/microservices/' + microserviceId, {});
  }

  removeRoleFromGroupInMicroservice(groupId: number, roleId: number, microserviceId: number): Observable<any> {
    return this.http.delete(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}
    ${groupId}/roles/${roleId}/microservices/${microserviceId}`, {});
  }

  getRolesOfGroup(groupId: number) {
    return this.http.get(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}
    ${groupId}/${this.rolesPathExtension}`);
  }

  removeUsersFromGroup(groupId: number, userIds: number[]) {
    return this.http.request('delete',
      `${this.config.userAndGroupRestBasePath + this.groupsPathExtension + groupId}/${this.usersPathExtension}`,
      {body: userIds});
  }

  addUsersToGroup(groupId: number, userIds: number[], groupIds: number[] = []) {
    return this.http.put(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension + groupId}/${this.usersPathExtension}`,
        this.groupMapper.createAddUsersToGroupDTO(userIds, groupIds));
  }
}
