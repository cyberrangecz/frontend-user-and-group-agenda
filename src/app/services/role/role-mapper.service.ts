import {Injectable} from '@angular/core';
import {RoleDTO} from '../../model/DTO/role-dto.model';
import {Role} from '../../model/role.model';
import {RestResourceDTO} from '../../model/DTO/rest-resource-dto.model';

@Injectable()
export class RoleMapperService {

  mapRoleDTOsWithPaginationToRoles(restResource: RestResourceDTO<RoleDTO>): Role[] {
    return this.mapRoleDTOsToRoles(restResource.content);
  }

    mapRoleDTOsToRoles(roleDTOs: RoleDTO[]): Role[] {
    return roleDTOs.map(roleDTO => this.mapRoleDTOToRole(roleDTO));
  }

  mapRoleDTOToRole(roleDTO: RoleDTO): Role {
    const result = new Role();
    result.name = roleDTO.role_type;
    result.microservice = roleDTO.name_of_microservice;
    result.id = roleDTO.id;
    return result;
  }
}
