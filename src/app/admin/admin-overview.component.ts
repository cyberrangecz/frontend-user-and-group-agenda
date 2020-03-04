import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientNotificationService} from './client-notification.service';
import {Kypo2UserAndGroupNotificationService} from '../../../projects/user-and-group-management/src/lib/services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../../../projects/user-and-group-management/src/lib/services/notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupNotification} from '../../../projects/user-and-group-management/src/lib/model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../projects/user-and-group-management/src/lib/model/enums/kypo2-user-and-group-notification-type.enum';
import {takeWhile} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Kypo2UserAndGroupRoutingEventService} from '../../../projects/user-and-group-management/src/lib/services/routing/kypo2-user-and-group-routing-event.service';

/**
 * Main smart component of user and group administration example. Serves as an example of usage of the library as well as for development
 */
@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css']
})
export class AdminOverviewComponent implements OnInit, OnDestroy {

  private isAlive = true;
  navLinks = [];

  constructor(private notificationService: Kypo2UserAndGroupNotificationService,
              private errorService: Kypo2UserAndGroupErrorService,
              private router: Router,
              private userAndGroupRouting: Kypo2UserAndGroupRoutingEventService,
              private clientNotificationService: ClientNotificationService) {
    this.notificationService.notification$
      .pipe(
        takeWhile(_ => this.isAlive)
      )
      .subscribe(notification => this.clientNotificationService.addNotification(notification));

    this.errorService.error$
      .pipe(
        takeWhile(_ => this.isAlive)
      )
      .subscribe(error => this.clientNotificationService.addNotification(new Kypo2UserAndGroupNotification(
        Kypo2UserAndGroupNotificationType.ERROR,
        `Http error while ${error.action}`)));

    this.userAndGroupRouting.navigate$
      .subscribe(navigateEvent => {
        if (navigateEvent.actionType && navigateEvent.resourceId) {
          return this.router.navigate(['admin', navigateEvent.resourceType.toLowerCase() , navigateEvent.resourceId, navigateEvent.actionType.toLowerCase()]);
        }
        if (navigateEvent.actionType) {
          return this.router.navigate(['admin', navigateEvent.resourceType.toLowerCase(), navigateEvent.actionType.toLowerCase()]);
        }
        return this.router.navigate(['admin', { outlets: { tab: [navigateEvent.resourceType.toLowerCase]}}]);
      });
  }

  ngOnInit() {
    this.navLinks = [
      {
        path: 'user',
        label: 'User',
      },
      {
        path: 'group',
        label: 'Group',
      },
      {
        path: 'microservices',
        label: 'Microservices',
      }
    ];
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
