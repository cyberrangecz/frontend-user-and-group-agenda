import {HttpParams} from '@angular/common/http';
import {RequestedPagination} from './requested-pagination';

export class PaginationHttpParams {
  static createPaginationParams(pagination: RequestedPagination): HttpParams {
    return new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort + ',' + pagination.sortDir);
  }

}
