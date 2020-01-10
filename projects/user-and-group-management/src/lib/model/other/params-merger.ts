import {HttpParams} from '@angular/common/http';

/**
 * Util class merging lists of http params into one http param object
 */
export class ParamsMerger {

  /**
   * Merges lists of http prams into one http param object
   * @param params list of http params to merge
   */
  static merge(params: HttpParams[]): HttpParams {
    let resultParams = new HttpParams();
    params.forEach(param =>
      param.keys().forEach(key =>
        resultParams = resultParams.set(key, param.get(key))
      )
    );
    return resultParams;
  }
}
