import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { SentinelResourceSelectorModule } from '@sentinel/components/resource-selector';
import { GroupEditCanDeactivate } from '../services/can-deactivate/group-edit-can-deactivate.service';
import {
  UserAndGroupNavigator,
  UserAndGroupDefaultNavigator,
  UserAndGroupAgendaConfig,
} from '@muni-kypo-crp/user-and-group-agenda';
import { GroupEditMaterialModule } from './group-edit-material.module';
import { GroupEditOverviewComponent } from './group-edit-overview.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupRoleAssignComponent } from './group-role-assign/group-role-assign.component';
import { GroupUserAssignComponent } from './group-user-assign/group-user-assign.component';

/**
 * Module containing necessary imports and components for group-overview state page
 */
@NgModule({
  declarations: [GroupEditOverviewComponent, GroupEditComponent, GroupRoleAssignComponent, GroupUserAssignComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GroupEditMaterialModule,
    SentinelResourceSelectorModule,
    SentinelTableModule,
    SentinelControlsModule,
  ],
  exports: [
    GroupEditMaterialModule,
    GroupEditComponent,
    GroupEditOverviewComponent,
    GroupRoleAssignComponent,
    GroupUserAssignComponent,
  ],
  providers: [GroupEditCanDeactivate, { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator }],
})
export class GroupEditComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<GroupEditComponentsModule> {
    return {
      ngModule: GroupEditComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
