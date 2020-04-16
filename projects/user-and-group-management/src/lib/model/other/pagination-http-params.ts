import { HttpParams } from '@angular/common/http';
import { KypoRequestedPagination } from 'kypo-common';

/**
 * Class transforming internal pagination to http params accepted by Trainings API
 */
export class PaginationHttpParams {
  /**
   * Transforms internal pagination to http params accepted by Trainings API
   * @param pagination pagination to transform to http params
   */
  static createPaginationParams(pagination: KypoRequestedPagination): HttpParams {
    return new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString())
      .set('sort', pagination.sort + ',' + pagination.sortDir);
  }
}
