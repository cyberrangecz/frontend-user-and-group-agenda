import {Pagination} from './pagination';

/**
 * Generic class wrapping resource and pagination
 */
export class PaginatedResource<T> {
  elements: T;
  pagination: Pagination;

  constructor(content: T, pagination: Pagination) {
    this.elements = content;
    this.pagination = pagination;
  }
}
