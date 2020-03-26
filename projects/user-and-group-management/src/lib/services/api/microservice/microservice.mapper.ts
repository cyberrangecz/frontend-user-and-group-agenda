import {Microservice} from '../../../model/microservice/microservice.model';
import {MicroserviceCreateDTO} from '../../../model/DTO/microservice/microservice-dto.model';
import {MicroserviceRole} from '../../../model/microservice/microservice-role.model';
import {MicroserviceRoleDTO} from '../../../model/DTO/microservice/microservice-role-dto';

/**
 * Class mapping internal model to DTOs and other way
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
