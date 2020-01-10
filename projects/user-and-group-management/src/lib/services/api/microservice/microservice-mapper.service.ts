import { Injectable } from '@angular/core';
import {Microservice} from '../../../model/microservice/microservice.model';
import {MicroserviceDTO} from '../../../model/DTO/microservice/microservice-dto.model';
import {MicroserviceRole} from '../../../model/microservice/microservice-role.model';
import {MicroserviceRoleDTO} from '../../../model/DTO/microservice/microservice-role-dto';

/**
 * Class mapping internal model to DTOs and other way
 */
@Injectable()
export class MicroserviceMapperService {

  constructor() { }

  /**
   * Maps microservice internal model to microservice dto
   * @param microservice internal model to be mapped to dto
   */
  mapMicroserviceToMicroserviceDTO(microservice: Microservice): MicroserviceDTO {
    const result = new MicroserviceDTO();
    result.endpoint = microservice.endpoint;
    result.name = microservice.name;
    result.roles = this.mapMicroserviceRolesToMicroserviceRolesDTO(microservice.roles);
    return result;
  }

  private mapMicroserviceRolesToMicroserviceRolesDTO(roles: MicroserviceRole[]): MicroserviceRoleDTO[] {
    const result: MicroserviceRoleDTO[] = [];
    roles.forEach(role => {
      const res = new MicroserviceRoleDTO();
      res.default = role.default;
      res.description = role.description;
      res.role_type = role.type;
      result.push(res);
    });
    return result;
  }
}
