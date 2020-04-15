import {NgModule} from '@angular/core';
import {SharedProvidersModule} from '../shared-providers.module';
import {CommonModule} from '@angular/common';
import {GroupOverviewComponentsModule} from '../../../../projects/user-and-group-management/src/public_api';
import {CustomConfig} from '../../custom-config';
import {GroupOverviewRoutingModule} from './group-overview-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    GroupOverviewRoutingModule,
    GroupOverviewComponentsModule.forRoot(CustomConfig)
  ]
})
export class GroupOverviewModule {

}
