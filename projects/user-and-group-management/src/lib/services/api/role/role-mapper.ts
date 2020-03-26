import {RestResourceDTO} from '../../../model/DTO/rest-resource-dto.model';
import {RoleDTO, UserRole} from 'kypo2-auth';
import {KypoPaginatedResource, KypoPagination} from 'kypo-common';

export class RoleMapper {

  /**
   * Maps roles DTOs to internal model
   * @param resource roles dto
   */
  static  mapRolesDTOtoRoles(resource: RestResourceDTO<RoleDTO>): KypoPaginatedResource<UserRole> {
    const content = resource.content.map(dto => UserRole.fromDTO(dto));

    // TODO: Replace once pagination is fixed
    /*    const pagination = new Pagination(
      resource.pagination.number,
      resource.pagination.number_of_elements,
      resource.pagination.size,
      resource.pagination.total_elements,
      resource.pagination.total_pages
    );*/
    const pagination = new KypoPagination(0, 0, 0, 0, 0);
    return new KypoPaginatedResource(content, pagination);
  }
}
