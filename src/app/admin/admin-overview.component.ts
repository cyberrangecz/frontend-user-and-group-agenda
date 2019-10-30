import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientNotificationService} from './client-notification.service';
import {Kypo2UserAndGroupNotificationService} from '../../../projects/user-and-group-management/src/lib/services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../../../projects/user-and-group-management/src/lib/services/notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupNotification} from '../../../projects/user-and-group-management/src/lib/model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../projects/user-and-group-management/src/lib/model/enums/alert-type.enum';
import {takeWhile} from 'rxjs/operators';

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
      }
    ];
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
