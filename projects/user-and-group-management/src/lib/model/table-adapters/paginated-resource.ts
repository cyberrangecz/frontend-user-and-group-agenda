import {Pagination} from './pagination';

export class PaginatedResource<T> {
  elements: T;
  pagination: Pagination;

  constructor(content: T, pagination: Pagination) {
    this.elements = content;
    this.pagination = pagination;
  }
}
