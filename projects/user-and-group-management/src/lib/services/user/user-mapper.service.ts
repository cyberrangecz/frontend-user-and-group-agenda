import {TableAdapter} from '../../model/table-data/table-adapter';
import {User, UserDTO} from 'kypo2-auth';
import {UserTableRow} from '../../model/table-data/user-table.row';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';
import {PaginationDTO} from '../../model/DTO/pagination-dto.model';
import {TablePagination} from '../../model/table-data/table-pagination';
import {Injectable} from '@angular/core';
import {UserForGroupsDTO} from '../../model/DTO/user/user-for-groups-dto.model';

@Injectable()
export class UserMapperService {

  mapUserDTOsWithPaginationToUserTable(restResource: RestResourceDTO<UserDTO>): TableAdapter<UserTableRow[]> {
    return new TableAdapter<UserTableRow[]>(
      restResource.content.map(userDTO => this.mapUserDTOToUserTable(userDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapUserDTOsWithPaginationToUsers(restResource: RestResourceDTO<UserDTO>): TableAdapter<User[]> {
    return new TableAdapter<User[]>(
      restResource.content.map(userDTO => this.mapUserDTOToUser(userDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  mapUserDTOToUserTable(userDTO: UserDTO): UserTableRow {
    const result = new UserTableRow();
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
    const result = new User([]);
    result.id = userForGroupDTO.id;
    result.name = `${userForGroupDTO.given_name} ${userForGroupDTO.family_name}`;
    result.issuer = userForGroupDTO.iss;
    result.nameWithAcademicTitles = userForGroupDTO.full_name;
    result.mail = userForGroupDTO.mail;
    result.login = userForGroupDTO.login;
    return result;
  }

  mapUserDTOToUser(userDTO: UserDTO): User {
    return User.fromDTO(userDTO);
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
    result.full_name = user.nameWithAcademicTitles;
    result.id = user.id;
    result.login = user.login;
    result.iss = user.issuer;
    result.mail = user.mail;
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
