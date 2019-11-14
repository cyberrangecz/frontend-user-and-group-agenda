import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Group} from '../../../model/group/group.model';
import {PaginatedResource} from '../../../model/table-adapters/paginated-resource';
import {Observable} from 'rxjs';
import {PaginationHttpParams} from '../../../model/other/pagination-http-params';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {GroupDTO} from '../../../model/DTO/group/group-dto.model';
import {map} from 'rxjs/operators';
import {GroupMapperService} from './group-mapper.service';
import {UserMapperService} from '../user/user-mapper.service';
import {ConfigService} from '../../../config/config.service';
import {UserAndGroupConfig} from '../../../config/user-and-group-config';
import {FilterParams} from '../../../model/other/filter-params';
import {Filter} from '../../../model/filters/filter';
import {ParamsMerger} from '../../../model/other/params-merger';
import {RoleDTO, UserRole} from 'kypo2-auth';
import {RequestedPagination} from '../../../model/other/requested-pagination';

@Injectable()
export class GroupFacadeService {

  private readonly config: UserAndGroupConfig;
  private readonly groupsPathExtension = 'groups/';
  private readonly usersPathExtension = 'users/';
  private readonly rolesPathExtension = 'roles/';


  constructor(private http: HttpClient,
              private configService: ConfigService,
              private userMapper: UserMapperService,
              private groupMapper: GroupMapperService) {
    this.config = this.configService.config;
  }

  getGroups(pagination: RequestedPagination, filter: Filter[] = []): Observable<PaginatedResource<Group[]>> {
    const params = ParamsMerger.merge([PaginationHttpParams.createPaginationParams(pagination), FilterParams.create(filter)]);
    return this.http.get<RestResourceDTO<GroupDTO>>(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      { params: params })
      .pipe(map(resp => this.groupMapper.mapGroupDTOsWithPaginationToTableGroups(resp)));
  }

  getGroupById(groupId: number): Observable<Group> {
    return this.http.get<GroupDTO>(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}${groupId}`)
      .pipe(map(groupDTO => this.groupMapper.mapGroupDTOToGroup(groupDTO)));
  }

  createGroup(group: Group, groupsToImportFromId: number[] = []): Observable<number> {
    return this.http.post<GroupDTO>(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      this.groupMapper.mapGroupToNewGroupDTO(group, groupsToImportFromId))
      .pipe(
        map(groupDTO => groupDTO.id)
      );
  }

  updateGroup(group: Group) {
    return this.http.put(this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      this.groupMapper.mapGroupToUpdateGroupDTO(group));
  }

  deleteGroups(groupIds: number[]) {
    return this.http.request('delete',
      this.config.userAndGroupRestBasePath + this.groupsPathExtension,
      {
        body: groupIds
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

  getRolesOfGroup(groupId: number): Observable<UserRole[]> {
    return this.http.get<RoleDTO[]>(`${this.config.userAndGroupRestBasePath + this.groupsPathExtension}
    ${groupId}/${this.rolesPathExtension}`)
      .pipe(
        map(roleDTOs => roleDTOs.map(roleDTO => UserRole.fromDTO(roleDTO)))
      );
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
