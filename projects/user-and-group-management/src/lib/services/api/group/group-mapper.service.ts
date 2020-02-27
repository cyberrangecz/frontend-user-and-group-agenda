import { Injectable} from '@angular/core';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {PaginatedResource} from '../../../model/table-adapters/paginated-resource';
import {PaginationDTO} from '../../../model/DTO/pagination-dto.model';
import {Pagination} from '../../../model/table-adapters/pagination';
import {GroupDTO} from '../../../model/DTO/group/group-dto.model';
import {Group} from '../../../model/group/group.model';
import {UserMapperService} from '../user/user-mapper.service';
import {NewGroupDTO} from '../../../model/DTO/group/new-group-dto.model';
import {UpdateGroupDTO} from '../../../model/DTO/group/update-group-dto.model';
import {AddUsersToGroupDTO} from '../../../model/DTO/user/add-user-to-group-dto.model';
import {UserRole} from 'kypo2-auth';

/**
 * Service mapping internal model to group DTOs and other way
 */
@Injectable()
export class GroupMapperService {

  constructor(private userMapper: UserMapperService) {
  }

  /**
   * Maps paginated group dto to internal model
   * @param restResource paginated group dto
   */
  mapPaginatedGroupDTOsToGroups(restResource: RestResourceDTO<GroupDTO>): PaginatedResource<Group> {
    return new PaginatedResource<Group>(
      restResource.content.map(groupDTO => this.mapGroupDTOToGroup(groupDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  /**
   * Maps group dto to internal model
   * @param groupDTO group dto to be mapped
   */
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

  /**
   * Maps internal model to new group dto
   * @param group group to be mapped
   * @param groupsToImportFromId ids of groups for import of users
   */
  mapGroupToNewGroupDTO(group: Group, groupsToImportFromId: number[]): NewGroupDTO {
    const result = new NewGroupDTO();
    result.name = group.name;
    result.description = group.description;
    result.group_ids_of_imported_users = groupsToImportFromId;
    result.users = this.userMapper.mapUsersToUserForGroupDTOs(group.members);
    if (group.expirationDate) {
      result.expiration_date = group.getExpirationDateUTC().toISOString();
    }
    return result;
  }

  /**
   * Maps internal model to update group dto
   * @param group group to be mapped
   */
  mapGroupToUpdateGroupDTO(group: Group): UpdateGroupDTO {
    const result = new UpdateGroupDTO();
    result.id = group.id;
    result.name = group.name;
    result.description = group.description;
    if (group.expirationDate) {
      result.expiration_date = group.getExpirationDateUTC().toISOString();
    }
    return result;
  }

  /**
   * Creates add users to group dto
   * @param userIds ids of users to add
   * @param groupIds ids of groups to import
   */
  createAddUsersToGroupDTO( userIds: number[], groupIds: number[]): AddUsersToGroupDTO {
    const result = new AddUsersToGroupDTO();
    result.ids_of_users_to_be_add = userIds;
    result.ids_of_groups_of_imported_users = groupIds;
    return result;
  }

  private mapPaginationDTOToPaginationModel(paginationDTO: PaginationDTO): Pagination {
    return new Pagination(
      paginationDTO.number,
      paginationDTO.number_of_elements,
      paginationDTO.size,
      paginationDTO.total_elements,
      paginationDTO.total_pages
    );
  }

}
