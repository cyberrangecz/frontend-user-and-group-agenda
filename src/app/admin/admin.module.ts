import {UserAndGroupManagementModule} from '../../../projects/user-and-group-management/src/public_api';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AdminOverviewComponent} from './admin-overview.component';
import {AdminRoutingModule} from './admin-routing.module';
import {CustomConfig} from '../custom-config';

@NgModule({
  declarations: [
    AdminOverviewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    UserAndGroupManagementModule.forRoot(CustomConfig),
  ],
  exports: [
    AdminOverviewComponent
  ]
})
export class AdminModule {
}
