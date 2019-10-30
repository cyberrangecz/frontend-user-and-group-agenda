import {TablePagination} from './table-pagination';

export class TableAdapter<T> {
  content: T;
  pagination: TablePagination;

  constructor(tableData: T, pagination: TablePagination) {
    this.content = tableData;
    this.pagination = pagination;
  }
}
