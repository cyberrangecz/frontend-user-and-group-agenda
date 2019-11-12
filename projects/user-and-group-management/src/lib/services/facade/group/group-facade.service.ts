import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from '../../../model/group/group.model';
import {TableAdapter} from '../../../model/table-adapters/table-adapter';
import {GroupTableRow} from '../../../model/table-adapters/group-table-row';
import {Observable} from 'rxjs';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {GroupDTO} from '../../../model/DTO/group/group-dto.model';
import {map} from 'rxjs/operators';
import {GroupMapperService} from './group-mapper.service';
import {UserMapperService} from '../user/user-mapper.service';
import {ConfigService} from '../../../config/config.service';
import {UserAndGroupManagementConfig} from '../../../config/user-and-group-management-config';
import {FilterParams} from '../../../model/other/filter-params';
import {Filter} from '../../../model/utils/Filter';
import {ParamsMerger} from '../../../model/other/params-merger';

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

  getGroupsTable(pagination = null, filter?: Filter[]): Observable<TableAdapter<GroupTableRow[]>> {
    if (pagination) {
      let params = PaginationHttpParams.createPaginationParams(pagination);

      if (filter) {
        params = ParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filter)]);
      }
      return this.http.get<RestResourceDTO<GroupDTO>>(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
        { params: params })
        .pipe(map(resp => this.groupMapper.mapGroupDTOsWithPaginationToTableDataWrapper(resp)));
    }
    return this.http.get<TableAdapter<GroupTableRow[]>>(this.config.userAndGroupRestBasePath + this.groupsPathExtension);
  }

  getGroups(pagination = null): Observable<TableAdapter<Group[]>> {
    if (pagination) {
      return this.http.get<RestResourceDTO<GroupDTO>>(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
        { params: PaginationHttpParams.createPaginationParams(pagination) })
        .pipe(map(resp => this.groupMapper.mapGroupDTOsWithPaginationToTableGroups(resp)));
    }
    return this.http.get<TableAdapter<Group[]>>(this.config.userAndGroupRestBasePath + this.groupsPathExtension);
  }

  getGroupById(groupId: number) {
    return this.http.get(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}${groupId}`);
  }

  createGroup(group: Group, groupsToImportFromId: number[] = []) {
    return this.http.post(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      this.groupMapper.mapGroupToNewGroupDTO(group, groupsToImportFromId));
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

  assignRoleToGroup(groupId: number, roleId: number): Observable<any> {
    return this.http.put(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension + groupId}/${this.rolesPathExtension}${roleId}`,
      {});
  }

  removeRoleFromGroup(groupId: number, roleId: number): Observable<any> {
    return this.http.delete(
      `${this.config.userAndGroupRestBasePath + this.groupsPathExtension + groupId}/${this.rolesPathExtension}${roleId}`
    );
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
