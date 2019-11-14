import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Group} from '../../../../projects/user-and-group-management/src/lib/model/group/group.model';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, mergeMap, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Kypo2GroupResolverHelperService} from '../../../../projects/user-and-group-management/src/lib/services/group/kypo2-group-resolver-helper.service';
import {ClientNotificationService} from '../client-notification.service';
import {Kypo2UserAndGroupNotification} from '../../../../projects/user-and-group-management/src/lib/model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../../projects/user-and-group-management/src/lib/model/enums/kypo2-user-and-group-notification-type.enum';

@Injectable()
export class GroupResolver implements Resolve<Group> {

  constructor(private groupResolveHelper: Kypo2GroupResolverHelperService,
              private router: Router,
              private errorHandler: ClientNotificationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> | Promise<Group> | Group {
    if (state.url.endsWith(`group/new`)) {
      return null;
    }
    if (route.paramMap.has('groupId')) {
      const id = Number(route.paramMap.get('groupId'));
      return this.groupResolveHelper.getById(id)
        .pipe(
          take(1),
          mergeMap(group => group ? of(group) : this.navigateToNew()),
          catchError(err => {
            this.errorHandler.addNotification(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.ERROR, 'Group resolver'));
            this.navigateToNew();
            return EMPTY;
          })
        );
    }
    return this.navigateToNew();
  }

  private navigateToNew(): Observable<never> {
    this.router.navigate(['admin', 'group', 'new']);
    return EMPTY;
  }}
