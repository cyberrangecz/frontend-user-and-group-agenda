import { Injectable} from '@angular/core';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {TableAdapter} from '../../model/table-data/table-adapter';
import {PaginationDTO} from '../../model/DTO/pagination-dto.model';
import {TablePagination} from '../../model/table-data/table-pagination';
import {GroupDTO} from '../../model/DTO/group/group-dto.model';
import {Group} from '../../model/group/group.model';
import {GroupTableRow} from '../../model/table-data/group-table-row';
import {UserMapperService} from '../user/user-mapper.service';
import {NewGroupDTO} from '../../model/DTO/group/new-group-dto.model';
import {UpdateGroupDTO} from '../../model/DTO/group/update-group-dto.model';
import {AddUsersToGroupDTO} from '../../model/DTO/user/add-user-to-group-dto.model';
import {UserRole} from 'kypo2-auth';

@Injectable()
export class GroupMapperService {

  constructor(private userMapper: UserMapperService) {

  }

  mapGroupDTOsWithPaginationToTableDataWrapper(restResource: RestResourceDTO<GroupDTO>): TableAdapter<GroupTableRow[]> {
    return new TableAdapter<GroupTableRow[]>(
      restResource.content.map(groupDTO => this.mapGroupDTOToGroupTableDataModel(groupDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapGroupDTOsWithPaginationToTableGroups(restResource: RestResourceDTO<GroupDTO>): TableAdapter<Group[]> {
    return new TableAdapter<Group[]>(
      restResource.content.map(groupDTO => this.mapGroupDTOToGroup(groupDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapGroupDTOToGroupTableDataModel(groupDTO: GroupDTO): GroupTableRow {
    return new GroupTableRow(this.mapGroupDTOToGroup(groupDTO));
  }

  mapGroupDTOToGroup(groupDTO: GroupDTO): Group {
    const result = new Group();
    result.id = groupDTO.id;
    result.name = groupDTO.name;
    result.description = groupDTO.description;
    result.canBeDeleted = groupDTO.can_be_deleted;
    result.members = this.userMapper.mapUserForGroupsDTOsToUsers(groupDTO.users);
    result.roles = groupDTO.roles.map(roleDTO => UserRole.fromDTO(roleDTO));
    if (groupDTO.expiration_date) {
      result.expirationDate = new Date(groupDTO.expiration_date);
    }
    return result;
  }

  mapGroupToNewGroupDTO(group: Group, groupsToImportFromId: number[]): NewGroupDTO {
    const result = new NewGroupDTO();
    result.name = group.name;
    result.description = group.description;
    result.group_ids_of_imported_users = groupsToImportFromId;
    result.users = this.userMapper.mapUsersToUserForGroupDTOs(group.members);
    if (group.expirationDate) {
      result.expiration_date = group.expirationDate.toISOString();
    }
    return result;
  }

  mapGroupToUpdateGroupDTO(group: Group): UpdateGroupDTO {
    const result = new UpdateGroupDTO();
    result.id = group.id;
    result.name = group.name;
    result.description = group.description;
    if (group.expirationDate) {
      result.expiration_date = group.expirationDate.toISOString();
    }
    return result;
  }

  createAddUsersToGroupDTO( userIds: number[], groupIds: number[]): AddUsersToGroupDTO {
    const result = new AddUsersToGroupDTO();
    result.ids_of_users_to_be_add = userIds;
    result.ids_of_groups_of_imported_users = groupIds;
    return result;
  }

  private mapPaginationDTOToPaginationModel(paginationDTO: PaginationDTO): TablePagination {
    return new TablePagination(
      paginationDTO.number,
      paginationDTO.number_of_elements,
      paginationDTO.size,
      paginationDTO.total_elements,
      paginationDTO.total_pages
    );
  }

}
