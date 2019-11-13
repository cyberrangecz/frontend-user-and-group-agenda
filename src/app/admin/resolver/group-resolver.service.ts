import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Group} from '../../../../projects/user-and-group-management/src/lib/model/group/group.model';
import {EMPTY, Observable, of} from 'rxjs';
import {Kypo2UserAndGroupErrorService} from '../../../../projects/user-and-group-management/src/lib/services/notification/kypo2-user-and-group-error.service';
import {GroupFacadeService} from '../../../../projects/user-and-group-management/src/lib/services/facade/group/group-facade.service';
import {Kypo2UserAndGroupRoutingEventService} from '../../../../projects/user-and-group-management/src/lib/services/routing/kypo2-user-and-group-routing-event.service';
import {catchError, mergeMap, take} from 'rxjs/operators';
import {Kypo2UserAndGroupError} from '../../../../projects/user-and-group-management/src/lib/model/events/kypo2-user-and-group-error';
import {Injectable} from '@angular/core';

@Injectable()
export class GroupResolver implements Resolve<Group> {

  constructor(private groupFacade: GroupFacadeService,
              private routeEventService: Kypo2UserAndGroupRoutingEventService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> | Promise<Group> | Group {
    if (state.url.endsWith(`group/new`)) {
      return null;
    }
    if (route.paramMap.has('groupId')) {
      const id = Number(route.paramMap.get('groupId'));
      return this.groupFacade.getGroupById(id)
        .pipe(
          take(1),
          mergeMap(group => group ? of(group) : this.navigateToNew()),
          catchError(err => {
            this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Group resolver'));
            this.navigateToNew();
            return EMPTY;
          })
        );
    }
    return this.navigateToNew();
  }

  private navigateToNew(): Observable<never> {
    this.routeEventService.navigate({ resourceType: 'GROUP', actionType: 'NEW'});
    return EMPTY;
  }}
