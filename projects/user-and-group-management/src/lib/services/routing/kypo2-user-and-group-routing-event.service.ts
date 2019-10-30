import {Observable, Subject} from 'rxjs';
import {Kypo2UserAndGroupRouteEvent} from '../../model/events/kypo2-user-and-group-route-event';

export class Kypo2UserAndGroupRoutingEventService {
  private navigateSubject: Subject<Kypo2UserAndGroupRouteEvent> = new Subject();
  navigate$: Observable<Kypo2UserAndGroupRouteEvent> = this.navigateSubject.asObservable();

  navigate(route: Kypo2UserAndGroupRouteEvent) {
    this.navigateSubject.next(route);
  }
}

