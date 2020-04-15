/**
 * Router breadcrumb title provider
 */
import {GroupResolver} from './group-resolver.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {GROUP_EDIT_PATH, GROUP_NEW_PATH, GROUP_SELECTOR} from '../../model/client/default-paths';
import {EMPTY, Observable} from 'rxjs';
import {Group} from '../../model/group/group.model';
import {map} from 'rxjs/operators';

@Injectable()
export class GroupBreadcrumbResolver implements Resolve<string> {

  constructor(private groupResolver: GroupResolver) {
  }

  /**
   * Retrieves a breadcrumb title based on provided url
   * @param route route snapshot
   * @param state router state snapshot
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    if (state.url.endsWith(GROUP_NEW_PATH)) {
      return 'Create';
    } else if (route.paramMap.has(GROUP_SELECTOR)) {
      const resolved = this.groupResolver.resolve(route, state) as Observable<Group>;
      return resolved.pipe(
        map(group => group ? this.getBreadcrumbFromGroup(group, state) : ''),
      );
    }
    return EMPTY;
  }

  private getBreadcrumbFromGroup(group: Group, state: RouterStateSnapshot): string {
    return state.url.includes(GROUP_EDIT_PATH)
      ? `Edit ${group.name}`
      : group.name;
  }
}
