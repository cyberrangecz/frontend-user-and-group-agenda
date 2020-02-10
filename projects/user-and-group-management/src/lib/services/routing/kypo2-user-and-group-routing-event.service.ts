import {Observable, Subject} from 'rxjs';
import {Kypo2UserAndGroupRouteEvent} from '../../model/events/kypo2-user-and-group-route-event';
import { Injectable } from "@angular/core";

/**
 * Service emitting requests for navigation between pages. Must be observed by client and mapped to its routing
 */
@Injectable()
export class Kypo2UserAndGroupRoutingEventService {
  private navigateSubject: Subject<Kypo2UserAndGroupRouteEvent> = new Subject();
  /**
   * Subscribe to observe navigation events. Client must map to internal routes and call Angular Router
   */
  navigate$: Observable<Kypo2UserAndGroupRouteEvent> = this.navigateSubject.asObservable();

  /**
   * Emits request to navigate to specific page
   * @param route route where to navigate
   */
  navigate(route: Kypo2UserAndGroupRouteEvent) {
    this.navigateSubject.next(route);
  }
}

