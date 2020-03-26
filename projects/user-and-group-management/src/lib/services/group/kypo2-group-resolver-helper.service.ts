import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Group} from '../../model/group/group.model';
import {GroupApi} from '../api/group/group-api.service';

/**
 * Helper service for a Resolver service implemented by client
 */
@Injectable()
export class Kypo2GroupResolverHelperService {

  constructor(private api: GroupApi) {
  }

  /**
   * Gets group with matching id
   * @param id id of a group
   */
  getById(id: number): Observable<Group> {
   return  this.api.get(id);
  }
}
