import {HttpParams} from '@angular/common/http';
import {Filter} from '../utils/Filter';

export class FilterParams {
  static create(filters: Filter[]): HttpParams {
    let params = new HttpParams();
    filters.forEach(filter => params = params.set(filter.paramName, filter.value));
    return params;
  }
}
