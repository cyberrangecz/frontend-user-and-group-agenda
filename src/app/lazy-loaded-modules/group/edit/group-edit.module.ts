import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { agendaConfig } from '../../../config';
import { SharedProvidersModule } from '../../shared-providers.module';
import { GroupEditRoutingModule } from './group-edit-routing.module';
import { GroupEditComponentsModule } from '@muni-kypo-crp/user-and-group-agenda/group-edit';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    GroupEditRoutingModule,
    GroupEditComponentsModule.forRoot(agendaConfig),
  ],
})
export class GroupEditModule {}
