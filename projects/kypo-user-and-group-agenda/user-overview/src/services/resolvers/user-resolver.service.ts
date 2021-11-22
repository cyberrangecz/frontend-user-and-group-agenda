import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '@muni-kypo-crp/user-and-group-model';
import { UserApi } from '@muni-kypo-crp/user-and-group-api';
import { USER_SELECTOR, UserAndGroupErrorHandler, UserAndGroupNavigator } from '@muni-kypo-crp/user-and-group-agenda';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, mergeMap, take } from 'rxjs/operators';

/**
 * Example resolver for user and user-overview state component
 */
@Injectable()
export class UserResolverService implements Resolve<User> {
  constructor(
    private router: Router,
    private api: UserApi,
    private errorHandler: UserAndGroupErrorHandler,
    private navigator: UserAndGroupNavigator
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Promise<User> | User {
    if (route.paramMap.has(USER_SELECTOR)) {
      const id = Number(route.paramMap.get(USER_SELECTOR));
      return this.api.get(id).pipe(
        take(1),
        mergeMap((user) => (user ? of(user) : this.navigateToOverview())),
        catchError((err) => {
          this.errorHandler.emit(err, 'Resolving user-overview');
          return this.navigateToOverview();
        })
      );
    }
    return this.navigateToOverview();
  }

  private navigateToOverview(): Observable<never> {
    this.router.navigate([this.navigator.toUserOverview()]);
    return EMPTY;
  }
}
