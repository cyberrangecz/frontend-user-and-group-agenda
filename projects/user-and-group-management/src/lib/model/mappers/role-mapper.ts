import { KypoPaginatedResource, KypoPagination } from 'kypo-common';
import { RoleDTO, UserRole } from 'kypo2-auth';
import { RestResourceDTO } from '../DTO/rest-resource-dto.model';
import { PaginationMapper } from './pagination-mapper';

export class RoleMapper {
  /**
   * Maps roles DTOs to internal model
   * @param resource roles dto
   */
  static mapRolesDTOtoRoles(resource: RestResourceDTO<RoleDTO>): KypoPaginatedResource<UserRole> {
    const content = resource.content.map((dto) => UserRole.fromDTO(dto));
    const pagination = PaginationMapper.mapDTOToPagination(resource.pagination);
    return new KypoPaginatedResource(content, pagination);
  }
}
