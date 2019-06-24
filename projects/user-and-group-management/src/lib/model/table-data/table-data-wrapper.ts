import {TableDataPagination} from './table-data-pagination';

export class TableDataWrapper<T> {
  tableData: T;
  pagination: TableDataPagination;

  constructor(tableData: T, pagination: TableDataPagination) {
    this.tableData = tableData;
    this.pagination = pagination;
  }
}
