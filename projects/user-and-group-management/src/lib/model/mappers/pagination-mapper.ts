import { KypoPagination } from 'kypo-common';
import { PaginationDTO } from '../DTO/pagination-dto.model';

/**
 * @dynamic
 */
export class PaginationMapper {
  static mapDTOToPagination(paginationDTO: PaginationDTO): KypoPagination {
    return new KypoPagination(
      paginationDTO.number,
      paginationDTO.number_of_elements,
      paginationDTO.size,
      paginationDTO.total_elements,
      paginationDTO.total_pages
    );
  }
}
