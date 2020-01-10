import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AdminOverviewComponent} from './admin-overview.component';
import {AdminRoutingModule} from './admin-routing.module';
import {MatButtonModule, MatIconModule, MatSnackBarModule, MatTabsModule} from '@angular/material';
import {NotificationComponent} from './notification/notification.component';
import {CustomConfig} from '../custom-config';
import {ClientNotificationService} from './client-notification.service';
import {
  Kypo2GroupOverviewModule, Kypo2MicroserviceEditCanDeactivate,
  Kypo2MicroserviceEditModule,
  Kypo2UserAndGroupEventModule,
  Kypo2UserModule
} from '../../../projects/user-and-group-management/src/public_api';


/**
 * Main module example of user and group library components
 */
@NgModule({
  declarations: [
    AdminOverviewComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    Kypo2UserAndGroupEventModule,
    Kypo2MicroserviceEditModule.forRoot(CustomConfig),
    Kypo2UserModule.forRoot(CustomConfig),
    Kypo2GroupOverviewModule.forRoot(CustomConfig),
    AdminRoutingModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  exports: [
    AdminOverviewComponent
  ],
  entryComponents: [NotificationComponent],
  providers: [
    ClientNotificationService,
    Kypo2MicroserviceEditCanDeactivate
  ]
})
export class AdminModule {
}
