import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';
import { GROUP_NEW_PATH, GROUP_PATH, GROUP_SELECTOR } from '../../model/client/default-paths';
import { Group } from '../../model/group/group.model';
import { GroupApi } from '../api/group/group-api.service';
import { UserAndGroupErrorHandler } from '../client/user-and-group-error-handler.service';

/**
 * Example resolver for user and group edit component
 */
@Injectable()
export class GroupResolver implements Resolve<Group> {
  constructor(private router: Router, private api: GroupApi, private errorHandler: UserAndGroupErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> | Promise<Group> | Group {
    if (state.url.endsWith(`${GROUP_PATH}/${GROUP_NEW_PATH}`)) {
      return null;
    }
    if (route.paramMap.has(GROUP_SELECTOR)) {
      const id = Number(route.paramMap.get(GROUP_SELECTOR));
      return this.api.get(id).pipe(
        take(1),
        mergeMap((group) => (group ? of(group) : this.navigateToNew())),
        catchError((err) => {
          this.errorHandler.emit(err, 'Resolving group');
          this.navigateToNew();
          return EMPTY;
        })
      );
    }
    return this.navigateToNew();
  }

  private navigateToNew(): Observable<never> {
    this.router.navigate([GROUP_NEW_PATH]);
    return EMPTY;
  }
}
