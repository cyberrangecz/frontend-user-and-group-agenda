import { KypoPaginatedResource } from 'kypo-common';
import { User, UserDTO } from 'kypo2-auth';
import { RestResourceDTO } from '../DTO/rest-resource-dto.model';
import { UserForGroupsDTO } from '../DTO/user/user-for-groups-dto.model';
import { PaginationMapper } from './pagination-mapper';

/**
 * Service to map internal model to dtos and other way
 */
export class UserMapper {
  /**
   * Maps user dtos to internal model
   * @param restResource user dtos
   */
  static mapUserDTOsToUsers(restResource: RestResourceDTO<UserDTO>): KypoPaginatedResource<User> {
    const result = new KypoPaginatedResource<User>(
      restResource.content.map((userDTO) => this.mapUserDTOToUser(userDTO)),
      PaginationMapper.mapDTOToPagination(restResource.pagination)
    );
    return result;
  }

  /**
   * Maps user dtos fro groups to internal model
   * @param userForGroupsDTOs user dtos
   */
  static mapUserForGroupsDTOsToUsers(userForGroupsDTOs: UserForGroupsDTO[]): User[] {
    if (userForGroupsDTOs) {
      return userForGroupsDTOs.map((userDTO) => this.mapUserForGroupsDTOToUser(userDTO));
    } else {
      return [];
    }
  }

  /**
   * Maps user fro group dto to iternal model
   * @param userForGroupDTO user dto
   */
  static mapUserForGroupsDTOToUser(userForGroupDTO: UserForGroupsDTO): User {
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
  static mapUserDTOToUser(userDTO: UserDTO): User {
    return User.fromDTO(userDTO);
  }

  /**
   * Maps users to user for groups dtos
   * @param users internal model users
   */
  static mapUsersToUserForGroupDTOs(users: User[]): UserForGroupsDTO[] {
    if (users) {
      return users.map((user) => this.mapUserToUserForGroupDTO(user));
    } else {
      return [];
    }
  }

  /**
   * Maps user to  user for group dto
   * @param user internal model users
   */
  static mapUserToUserForGroupDTO(user: User): UserForGroupsDTO {
    const result = new UserForGroupsDTO();
    result.full_name = user.nameWithAcademicTitles;
    result.id = user.id;
    result.login = user.login;
    result.iss = user.issuer;
    result.mail = user.mail;
    return result;
  }
}
