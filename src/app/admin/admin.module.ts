import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AdminOverviewComponent} from './admin-overview.component';
import {AdminRoutingModule} from './admin-routing.module';
import {MatButtonModule, MatIconModule, MatSnackBarModule, MatTabsModule} from '@angular/material';
import {NotificationComponent} from './notification/notification.component';
import {UserAndGroupManagementModule} from '../../../projects/user-and-group-management/src/lib/components/user-and-group-management.module';
import {CustomConfig} from '../custom-config';
import {ClientNotificationService} from './client-notification.service';


@NgModule({
  declarations: [
    AdminOverviewComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    UserAndGroupManagementModule.forRoot(CustomConfig),
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
