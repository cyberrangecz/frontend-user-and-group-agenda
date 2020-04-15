import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from '../../../model/group/group.model';
import {KypoPaginatedResource} from 'kypo-common';
import {Observable} from 'rxjs';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {GroupDTO} from '../../../model/DTO/group/group-dto.model';
import {map} from 'rxjs/operators';
import {GroupMapper} from '../../../model/mappers/group.mapper';
import {UserAndGroupContext} from '../../shared/user-and-group-context.service';
import {UserAndGroupConfig} from '../../../model/client/user-and-group-config';
import {FilterParams} from '../../../model/other/filter-params';
import {KypoFilter} from 'kypo-common';
import {KypoParamsMerger} from 'kypo-common';
import {RoleDTO, UserRole} from 'kypo2-auth';
import {KypoRequestedPagination} from 'kypo-common';
import {GroupApi} from './group-api.service';
import {RoleMapper} from '../../../model/mappers/role-mapper';

/**
 * Default implementation of service abstracting http communication with group endpoints.
 */
@Injectable()
export class GroupDefaultApi extends GroupApi {

  private readonly config: UserAndGroupConfig;
  private readonly groupsPathExtension = 'groups';
  private readonly usersPathExtension = 'users';
  private readonly rolesPathExtension = 'roles';


  constructor(private http: HttpClient,
              private configService: UserAndGroupContext) {
    super();
    this.config = this.configService.config;
  }

  /**
   * Sends http request to get paginated groups
   * @param pagination requested pagination
   * @param filter filter to be applied on groups
   */
  getAll(pagination: KypoRequestedPagination, filter: KypoFilter[] = []): Observable<KypoPaginatedResource<Group>> {
    const params = KypoParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filter)]);
    return this.http.get<RestResourceDTO<GroupDTO>>(`${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}`,
      { params: params })
      .pipe(map(resp => GroupMapper.mapPaginatedGroupDTOsToGroups(resp)));
  }

  /**
   * Sends http request to get group by id
   * @param groupId id of requested group
   */
  get(groupId: number): Observable<Group> {
    return this.http.get<GroupDTO>(`${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}/${groupId}`)
      .pipe(map(groupDTO => GroupMapper.mapGroupDTOToGroup(groupDTO)));
  }

  /**
   * Sends http request to create new group
   * @param group group to create
   * @param groupsToImportFromId ids of groups to import users from
   */
  create(group: Group, groupsToImportFromId: number[] = []): Observable<number> {
    return this.http.post<GroupDTO>(`${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}`,
      GroupMapper.mapGroupToCreateGroupDTO(group, groupsToImportFromId))
      .pipe(
        map(groupDTO => groupDTO.id)
      );
  }

  /**
   * Sends http request to update existing group
   * @param group group to update
   */
  update(group: Group): Observable<any> {
    return this.http.put(`${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}`,
      GroupMapper.mapGroupToUpdateGroupDTO(group));
  }

  /**
   * Sends http request to delete multiple groups
   * @param groupIds ids of groups to delete
   */
  deleteMultiple(groupIds: number[]): Observable<any> {
    return this.http.request('delete',
      this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      {
        body: groupIds
      });
  }

  /**
   * Sends http request to delete group
   * @param groupId id of a group to delete
   */
  delete(groupId: number): Observable<any> {
    return this.http.delete(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}${groupId}`);
  }

  /**
   * Sends http request to assign role to group
   * @param groupId id of a group to be associated with a role
   * @param roleId id of a role to be assigned to a group
   */
  assignRole(groupId: number, roleId: number): Observable<any> {
    return this.http.put(`${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}/${groupId}/${this.rolesPathExtension}/${roleId}`,
      {});
  }

  /**
   * Sends http request to remove role from group
   * @param groupId id of group which associated with a role should be cancelled
   * @param roleId id of a role to be removed from group
   */
  removeRole(groupId: number, roleId: number): Observable<any> {
    return this.http.delete(
      `${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}/${groupId}/${this.rolesPathExtension}/${roleId}`
    );
  }

  /**
   * Sends http request to get all roles of a group
   * @param groupId id of a group associated with roles
   * @param pagination requested pagination
   * @param filter filter to be applied on result
   */
  getRolesOfGroup(groupId: number, pagination: KypoRequestedPagination, filter: KypoFilter[] = []): Observable<KypoPaginatedResource<UserRole>> {
    const params = KypoParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filter)]);
    return this.http.get<RestResourceDTO<RoleDTO>>(
      `${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}/${groupId}/${this.rolesPathExtension}`,
      {params: params})
      .pipe(
        map(roleDTOs => RoleMapper.mapRolesDTOtoRoles(roleDTOs))
      );
  }

  /**
   * Sends http request to remove users from a group
   * @param groupId id of a group associated with users
   * @param userIds ids of users to be removed from a group
   */
  removeUsersFromGroup(groupId: number, userIds: number[]): Observable<any> {
    return this.http.request('delete',
      `${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}/${groupId}/${this.usersPathExtension}`,
      {body: userIds});
  }

  /**
   * Sends http request to add users to a group
   * @param groupId id of a group to be associated with users
   * @param userIds ids of users to be added to the group
   * @param groupIds ids of a groups from where users should be imported
   */
  addUsersToGroup(groupId: number, userIds: number[], groupIds: number[] = []): Observable<any> {
    return this.http.put(`${this.config.userAndGroupRestBasePath}${this.groupsPathExtension}/${groupId}/${this.usersPathExtension}`,
        GroupMapper.createAddUsersToGroupDTO(userIds, groupIds));
  }
}
