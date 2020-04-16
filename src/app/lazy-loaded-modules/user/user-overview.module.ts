import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserComponentsModule } from '../../../../projects/user-and-group-management/src/public_api';
import { CustomConfig } from '../../custom-config';
import { SharedProvidersModule } from '../shared-providers.module';
import { UserOverviewRoutingModule } from './user-overview-routing.module';

@NgModule({
  imports: [CommonModule, SharedProvidersModule, UserOverviewRoutingModule, UserComponentsModule.forRoot(CustomConfig)],
})
export class UserOverviewModule {}
