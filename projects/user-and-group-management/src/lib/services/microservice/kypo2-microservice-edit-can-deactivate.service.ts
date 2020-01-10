import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Kypo2MicroserviceEditOverviewComponent} from '../../components/microservice/kypo2-microservice-edit-overview.component';
import {Observable} from 'rxjs';

/**
 * CanDeactivate service for microservice edit component.
 * Usage described in @link https://angular.io/api/router/CanDeactivate
 */
export class Kypo2MicroserviceEditCanDeactivate implements CanDeactivate<Kypo2MicroserviceEditOverviewComponent> {
  canDeactivate(component: Kypo2MicroserviceEditOverviewComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate();
  }
}
