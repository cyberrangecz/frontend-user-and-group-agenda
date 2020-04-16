import { HttpParams } from '@angular/common/http';
import { KypoFilter } from 'kypo-common';

/**
 * Class transforming internal filter to http params
 */
export class FilterParams {
  /**
   * transforms internal filter to http params
   * @param filters filters to be transformed to http params
   */
  static create(filters: KypoFilter[]): HttpParams {
    let params = new HttpParams();
    filters.forEach((filter) => (params = params.set(filter.paramName, filter.value)));
    return params;
  }
}
