import { Injectable} from '@angular/core';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {TableDataWrapper} from '../../model/table-data/table-data-wrapper';
import {PaginationDTO} from '../../model/DTO/pagination-dto.model';
import {TableDataPagination} from '../../model/table-data/table-data-pagination';
import {GroupDTO} from '../../model/DTO/group/group-dto.model';
import {Group} from '../../model/group/group.model';
import {GroupTableDataModel} from '../../model/table-data/group-table-data.model';
import {RoleMapperService} from '../role/role-mapper.service';
import {UserMapperService} from '../user/user-mapper.service';
import {NewGroupDTO} from '../../model/DTO/group/new-group-dto.model';
import {UpdateGroupDTO} from '../../model/DTO/group/update-group-dto.model';
import {AddUsersToGroupDTO} from '../../model/DTO/user/add-user-to-group-dto.model';

@Injectable()
export class GroupMapperService {

  constructor(private roleMapper: RoleMapperService,
              private userMapper: UserMapperService) {

  }

  mapGroupDTOsWithPaginationToTableDataWrapper(restResource: RestResourceDTO<GroupDTO>): TableDataWrapper<GroupTableDataModel[]> {
    return new TableDataWrapper<GroupTableDataModel[]>(
      restResource.content.map(groupDTO => this.mapGroupDTOToGroupTableDataModel(groupDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapGroupDTOsWithPaginationToTableGroups(restResource: RestResourceDTO<GroupDTO>): TableDataWrapper<Group[]> {
    return new TableDataWrapper<Group[]>(
      restResource.content.map(groupDTO => this.mapGroupDTOToGroup(groupDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapGroupDTOToGroupTableDataModel(groupDTO: GroupDTO): GroupTableDataModel {
    const result = new GroupTableDataModel();
    result.group = this.mapGroupDTOToGroup(groupDTO);
    return result;
  }

  mapGroupDTOToGroup(groupDTO: GroupDTO): Group {
    const result = new Group();
    result.id = groupDTO.id;
    result.name = groupDTO.name;
    result.description = groupDTO.description;
    result.canBeDeleted = groupDTO.can_be_deleted;
    result.members = this.userMapper.mapUserForGroupsDTOsToUsers(groupDTO.users);
    result.roles = this.roleMapper.mapRoleDTOsToRoles(groupDTO.roles);
    return result;
  }

  mapGroupToNewGroupDTO(group: Group, groupsToImportFromId: number[]): NewGroupDTO {
    const result = new NewGroupDTO();
    result.name = group.name;
    result.description = group.description;
    result.group_ids_of_imported_users = groupsToImportFromId;
    result.users = this.userMapper.mapUsersToUserForGroupDTOs(group.members);
    return result;
  }

  mapGroupToUpdateGroupDTO(group: Group): UpdateGroupDTO {
    const result = new UpdateGroupDTO();
    result.id = group.id;
    result.name = group.name;
    result.description = group.description;
    return result;
  }

  createAddUsersToGroupDTO( userIds: number[], groupIds: number[]): AddUsersToGroupDTO {
    const result = new AddUsersToGroupDTO();
    result.ids_of_users_to_be_add = userIds;
    result.ids_of_groups_of_imported_users = groupIds;
    return result;
  }

  private mapPaginationDTOToPaginationModel(paginationDTO: PaginationDTO): TableDataPagination {
    return new TableDataPagination(
      paginationDTO.number,
      paginationDTO.number_of_elements,
      paginationDTO.size,
      paginationDTO.total_elements,
      paginationDTO.total_pages
    );
  }

}
