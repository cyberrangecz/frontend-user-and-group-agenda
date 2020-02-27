import {PaginatedResource} from '../../../model/table-adapters/paginated-resource';
import {User, UserDTO} from 'kypo2-auth';
import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {PaginationDTO} from '../../../model/DTO/pagination-dto.model';
import {Pagination} from '../../../model/table-adapters/pagination';
import {Injectable} from '@angular/core';
import {UserForGroupsDTO} from '../../../model/DTO/user/user-for-groups-dto.model';

/**
 * Service to map internal model to dtos and other way
 */
@Injectable()
export class UserMapperService {

  /**
   * Maps user dtos to internal model
   * @param restResource user dtos
   */
  mapUserDTOsToUsers(restResource: RestResourceDTO<UserDTO>): PaginatedResource<User> {
    return new PaginatedResource<User>(
      restResource.content.map(userDTO => this.mapUserDTOToUser(userDTO)),
      this.mapPaginationDTOToPaginationModel(restResource.pagination));
  }

  /**
   * Maps user dtos fro groups to internal model
   * @param userForGroupsDTOs user dtos
   */
  mapUserForGroupsDTOsToUsers(userForGroupsDTOs: UserForGroupsDTO[]): User[] {
    if (userForGroupsDTOs) {
      return userForGroupsDTOs.map(userDTO => this.mapUserForGroupsDTOToUser(userDTO));
    } else {
      return [];
    }
  }

  /**
   * Maps user fro group dto to iternal model
   * @param userForGroupDTO user dto
   */
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

  /**
   * Maps user dto to user
   * @param userDTO user dto
   */
  mapUserDTOToUser(userDTO: UserDTO): User {
    return User.fromDTO(userDTO);
  }

  /**
   * Maps users to user for groups dtos
   * @param users internal model users
   */
  mapUsersToUserForGroupDTOs(users: User[]): UserForGroupsDTO[] {
    if (users) {
      return users.map(user => this.mapUserToUserForGroupDTO(user));
    } else {
      return [];
    }
  }

  /**
   * Maps user to  user for group dto
   * @param user internal model users
   */
  mapUserToUserForGroupDTO(user: User): UserForGroupsDTO {
    const result = new UserForGroupsDTO();
    result.full_name = user.nameWithAcademicTitles;
    result.id = user.id;
    result.login = user.login;
    result.iss = user.issuer;
    result.mail = user.mail;
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
