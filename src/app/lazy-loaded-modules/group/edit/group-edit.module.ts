import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupEditComponentsModule } from '../../../../../projects/user-and-group-management/src/public_api';
import { CustomConfig } from '../../../custom-config';
import { SharedProvidersModule } from '../../shared-providers.module';
import { GroupEditRoutingModule } from './group-edit-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    GroupEditRoutingModule,
    GroupEditComponentsModule.forRoot(CustomConfig),
  ],
})
export class GroupEditModule {}
