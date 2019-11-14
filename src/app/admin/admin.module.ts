import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AdminOverviewComponent} from './admin-overview.component';
import {AdminRoutingModule} from './admin-routing.module';
import {MatButtonModule, MatIconModule, MatSnackBarModule, MatTabsModule} from '@angular/material';
import {NotificationComponent} from './notification/notification.component';
import {CustomConfig} from '../custom-config';
import {ClientNotificationService} from './client-notification.service';
import {Kypo2GroupModule, Kypo2MicroserviceEditModule, Kypo2UserModule} from '../../../projects/user-and-group-management/src/public_api';


@NgModule({
  declarations: [
    AdminOverviewComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    Kypo2MicroserviceEditModule.forRoot(CustomConfig),
    Kypo2UserModule.forRoot(CustomConfig),
    Kypo2GroupModule.forRoot(CustomConfig),
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
  ]
})
export class AdminModule {
}
