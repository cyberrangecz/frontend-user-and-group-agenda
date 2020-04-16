import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupOverviewComponentsModule } from '../../../../projects/user-and-group-management/src/public_api';
import { CustomConfig } from '../../custom-config';
import { SharedProvidersModule } from '../shared-providers.module';
import { GroupOverviewRoutingModule } from './group-overview-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    GroupOverviewRoutingModule,
    GroupOverviewComponentsModule.forRoot(CustomConfig),
  ],
})
export class GroupOverviewModule {}
