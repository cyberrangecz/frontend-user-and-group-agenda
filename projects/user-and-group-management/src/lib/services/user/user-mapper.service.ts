import {TableDataWrapper} from '../../model/table-data/table-data-wrapper';
import {UserDTO} from '../../model/DTO/user/user-dto.model';
import {UserTableDataModel} from '../../model/table-data/user-table-data.model';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {PaginationDTO} from '../../model/DTO/pagination-dto.model';
import {TableDataPagination} from '../../model/table-data/table-data-pagination';
import {User} from '../../model/user/user.model';
import {Injectable} from '@angular/core';
import {RoleMapperService} from '../role/role-mapper.service';
import {UserForGroupsDTO} from '../../model/DTO/user/user-for-groups-dto.model';

@Injectable()
export class UserMapperService {

  constructor(private roleMapper: RoleMapperService) {

  }

  mapUserDTOsWithPaginationToUserTableDataModel(restResource: RestResourceDTO<UserDTO>): TableDataWrapper<UserTableDataModel[]> {
    return new TableDataWrapper<UserTableDataModel[]>(
      restResource.content.map(userDTO => this.mapUserDTOToUserTableDataModel(userDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapUserDTOsWithPaginationToUsers(restResource: RestResourceDTO<UserDTO>): TableDataWrapper<User[]> {
    return new TableDataWrapper<User[]>(
      restResource.content.map(userDTO => this.mapUserDTOToUser(userDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapUserDTOToUserTableDataModel(userDTO: UserDTO): UserTableDataModel {
    const result = new UserTableDataModel();
    result.user = this.mapUserDTOToUser(userDTO);
    return result;
  }

  mapUserDTOsToUsers(userDTOs: UserDTO[]): User[] {
    return userDTOs.map(userDTO => this.mapUserDTOToUser(userDTO));
  }

  mapUserForGroupsDTOsToUsers(userForGroupsDTOs: UserForGroupsDTO[]): User[] {
    if (userForGroupsDTOs) {
      return userForGroupsDTOs.map(userDTO => this.mapUserForGroupsDTOToUser(userDTO));
    } else {
      return [];
    }
  }

  mapUserForGroupsDTOToUser(userForGroupDTO: UserForGroupsDTO): User {
    const result = new User();
    result.id = userForGroupDTO.id;
    result.name = userForGroupDTO.full_name;
    result.mail = userForGroupDTO.mail;
    result.login = userForGroupDTO.login;
    return result;
  }

  mapUserDTOToUser(userDTO: UserDTO): User {
    const result = new User();
    result.id = userDTO.id;
    result.name = userDTO.full_name;
    result.mail = userDTO.mail;
    result.login = userDTO.login;
    result.roles = this.roleMapper.mapRoleDTOsToRoles(userDTO.roles);
    return result;
  }

  mapUsersToUserForGroupDTOs(users: User[]): UserForGroupsDTO[] {
    if (users) {
      return users.map(user => this.mapUserToUserForGroupDTO(user));
    } else {
      return [];
    }
  }

  mapUserToUserForGroupDTO(user: User): UserForGroupsDTO {
    const result = new UserForGroupsDTO();
    result.full_name = user.name;
    result.id = user.id;
    result.login = user.login;
    result.mail = user.mail;
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
