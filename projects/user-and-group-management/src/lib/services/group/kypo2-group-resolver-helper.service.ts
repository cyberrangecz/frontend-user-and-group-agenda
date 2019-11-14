import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {GroupFacadeService} from '../facade/group/group-facade.service';
import {Group} from '../../model/group/group.model';

@Injectable()
export class Kypo2GroupResolverHelperService {

  constructor(private groupFacade: GroupFacadeService) {
  }

  getById(id: number): Observable<Group> {
   return  this.groupFacade.getById(id);
  }
}
