import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupEditComponentsModule } from '../../../../../projects/kypo-user-and-group-agenda/src/public_api';
import { agendaConfig } from '../../../config';
import { SharedProvidersModule } from '../../shared-providers.module';
import { GroupEditRoutingModule } from './group-edit-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    GroupEditRoutingModule,
    GroupEditComponentsModule.forRoot(agendaConfig),
  ],
})
export class GroupEditModule {}
