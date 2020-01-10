import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroupApi} from '../api/group/group-api.service';
import {Group} from '../../model/group/group.model';

/**
 * Helper service for a Resolver service implemented by client
 */
@Injectable()
export class Kypo2GroupResolverHelperService {

  constructor(private groupFacade: GroupApi) {
  }

  /**
   * Gets group with matching id
   * @param id id of a group
   */
  getById(id: number): Observable<Group> {
   return  this.groupFacade.get(id);
  }
}
