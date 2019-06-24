import {Pagination} from './pagination';

export class PaginationFactory {

  static createWithSort(page: number, size: number, sort: string, sortDir: string): Pagination {
    const pagination = new Pagination();
    pagination.page = page;
    pagination.size = size;
    pagination.sort = sort;
    pagination.sortDir = sortDir;
    return pagination;
  }

  static createWithoutSort(page: number, size: number): Pagination {
    const pagination = new Pagination();
    pagination.page = page;
    pagination.size = size;
    return pagination;
  }

}
