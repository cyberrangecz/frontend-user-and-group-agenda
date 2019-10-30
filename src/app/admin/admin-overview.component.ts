import { Component, OnInit } from '@angular/core';
import {ClientNotificationService} from './client-notification.service';
import {Kypo2UserAndGroupNotificationService} from '../../../projects/user-and-group-management/src/lib/services/notification/kypo2-user-and-group-notification.service';
@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css']
})
export class AdminOverviewComponent implements OnInit {

  navLinks = [];

  constructor(private notificationService: Kypo2UserAndGroupNotificationService,
              private clientNotificationService: ClientNotificationService) {
    this.notificationService.notification$.subscribe(notification => this.clientNotificationService.addNotification(notification));
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
}
