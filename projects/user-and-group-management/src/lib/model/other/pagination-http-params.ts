import {HttpParams} from '@angular/common/http';
import {Pagination} from './pagination';

export class PaginationHttpParams {
  static createPaginationParams(pagination: Pagination): HttpParams {
    return new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort + ',' + pagination.sortDir);
  }

}
