import {Kypo2UserAndGroupNotificationService} from '../../services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupRoutingEventService} from '../../services/routing/kypo2-user-and-group-routing-event.service';
import {Kypo2UserAndGroupErrorService} from '../../services/notification/kypo2-user-and-group-error.service';
import {NgModule} from '@angular/core';

/**
 * Module containing shared providers designated for the library client
 */
@NgModule({
  providers: [
    Kypo2UserAndGroupNotificationService,
    Kypo2UserAndGroupRoutingEventService,
    Kypo2UserAndGroupErrorService,
  ]
})
export class Kypo2UserAndGroupEventModule {
}
