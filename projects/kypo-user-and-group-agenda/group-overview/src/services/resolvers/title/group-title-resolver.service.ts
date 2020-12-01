import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Group } from '@kypo/user-and-group-model';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { GROUP_NEW_PATH, GROUP_PATH, GROUP_SELECTOR } from '@kypo/user-and-group-agenda';
import { GroupResolver } from '../group-resolver.service';

@Injectable()
export class GroupTitleResolver implements Resolve<string> {
  readonly CREATE_GROUP_TITLE = 'Create Group';

  constructor(private groupResolver: GroupResolver) {}

  /**
   * Retrieves a specific resource title based on id provided in url
   * @param route route snapshot
   * @param state router state snapshot
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    if (state.url.endsWith(`${GROUP_PATH}/${GROUP_NEW_PATH}`)) {
      return this.CREATE_GROUP_TITLE;
    } else if (route.paramMap.has(GROUP_SELECTOR)) {
      const resolved = this.groupResolver.resolve(route, state) as Observable<Group>;
      return resolved.pipe(
        take(1),
        map((group) => (group ? `Edit ${group.name}` : '')),
        catchError((err) => of(''))
      );
    }
    return '';
  }
}
