import {NgModule} from '@angular/core';
import {SharedProvidersModule} from '../shared-providers.module';
import {CommonModule} from '@angular/common';
import {UserOverviewRoutingModule} from './user-overview-routing.module';
import {UserComponentsModule} from '../../../../projects/user-and-group-management/src/public_api';
import {CustomConfig} from '../../custom-config';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    UserOverviewRoutingModule,
    UserComponentsModule.forRoot(CustomConfig)
  ]
})
export class UserOverviewModule {

}
