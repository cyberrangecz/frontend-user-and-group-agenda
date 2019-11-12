import { Injectable } from '@angular/core';
import {Microservice} from '../../../model/microservice/microservice.model';
import {MicroserviceDTO} from '../../../model/DTO/microservice/microservice-dto.model';
import {Role} from '../../../model/microservice/role.model';
import {MicroserviceRoleDTO} from '../../../model/DTO/microservice/microservice-role-dto';

@Injectable()
export class MicroserviceMapperService {

  constructor() { }

  mapMicroserviceToMicroserviceDTO(microservice: Microservice): MicroserviceDTO {
    const result = new MicroserviceDTO();
    result.endpoint = microservice.endpoint;
    result.name = microservice.name;
    result.roles = this.mapMicroserviceRolesToMicroserviceRolesDTO(microservice.roles);
    return result;
  }

  private mapMicroserviceRolesToMicroserviceRolesDTO(roles: Role[]): MicroserviceRoleDTO[] {
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
