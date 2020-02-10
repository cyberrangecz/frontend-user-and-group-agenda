import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Kypo2GroupEditOverviewComponent} from '../../components/group/group-edit-overview/kypo2-group-edit-overview.component';
import {Observable} from 'rxjs';
import { Injectable } from "@angular/core";

/**
 * CanDeactivate service for group edit component.
 * Usage described in @link https://angular.io/api/router/CanDeactivate
 */
@Injectable()
export class Kypo2GroupEditCanDeactivate implements CanDeactivate<Kypo2GroupEditOverviewComponent> {
  canDeactivate(component: Kypo2GroupEditOverviewComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
