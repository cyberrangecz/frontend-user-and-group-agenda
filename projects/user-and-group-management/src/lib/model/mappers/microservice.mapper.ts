import {Microservice} from '../microservice/microservice.model';
import {MicroserviceCreateDTO} from '../DTO/microservice/microservice-dto.model';
import {MicroserviceRole} from '../microservice/microservice-role.model';
import {MicroserviceRoleDTO} from '../DTO/microservice/microservice-role-dto';

/**
 * Class mapping internal model to DTOs and other way
 * @dynamic
 */
export class MicroserviceMapper {

  /**
   * Maps microservice internal model to microservice dto
   * @param microservice internal model to be mapped to dto
   */
  static mapMicroserviceToMicroserviceCreateDTO(microservice: Microservice): MicroserviceCreateDTO {
    const result = new MicroserviceCreateDTO();
    result.endpoint = microservice.endpoint;
    result.name = microservice.name;
    result.roles = this.mapMicroserviceRolesToMicroserviceRolesDTO(microservice.roles);
    return result;
  }

  private static mapMicroserviceRolesToMicroserviceRolesDTO(roles: MicroserviceRole[]): MicroserviceRoleDTO[] {
    return roles.map(role => {
      const dto = new MicroserviceRoleDTO();
      dto.default = role.default;
      dto.description = role.description;
      dto.role_type = role.type;
      return dto;
    });
  }
}
