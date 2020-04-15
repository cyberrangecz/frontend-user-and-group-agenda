import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, mergeMap, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {GroupResolver} from './group-resolver.service';
import {GROUP_NEW_PATH, GROUP_PATH, GROUP_SELECTOR} from '../../model/client/default-paths';
import {Group} from '../../model/group/group.model';

@Injectable()
export class GroupTitleResolver implements Resolve<string> {

  constructor(private groupResolver: GroupResolver) {
  }

  /**
   * Retrieves a specific resource title based on id provided in url
   * @param route route snapshot
   * @param state router state snapshot
   */
  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    if (state.url.endsWith(`${GROUP_PATH}/${GROUP_NEW_PATH}`)) {
      return 'Create Group';
    } else if (route.paramMap.has(GROUP_SELECTOR)) {
      const resolved = this.groupResolver.resolve(route, state) as Observable<Group>;
      return resolved
        .pipe(
          take(1),
          mergeMap(group => group ? of(`Edit ${group.name}`) : ''),
          catchError(err => '')
        );
    }
    return '';
  }
}
