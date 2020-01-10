import {NgModule} from '@angular/core';
import {GroupEditComponent} from './group-edit/group-edit.component';
import {Kypo2GroupEditOverviewComponent} from './kypo2-group-edit-overview.component';
import {Kypo2GroupEditMaterialModule} from './kypo2-group-edit-material.module';
import {CommonModule} from '@angular/common';
import {GroupEditControlsComponent} from './group-edit-controls/group-edit-controls.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GroupRoleAssignComponent} from './group-role-assign/group-role-assign.component';
import {Kypo2ResourceSelectorModule} from 'kypo2-user-assign';
import {Kypo2TableModule} from 'kypo2-table';
import {GroupUserAssignComponent} from './group-user-assign/group-user-assign.component';

/**
 * Module containing necessary imports and components for group edit page
 */
@NgModule({
  declarations: [
    Kypo2GroupEditOverviewComponent,
    GroupEditComponent,
    GroupEditControlsComponent,
    GroupRoleAssignComponent,
    GroupUserAssignComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Kypo2GroupEditMaterialModule,
    Kypo2ResourceSelectorModule,
    Kypo2TableModule
  ],
  exports: [
    Kypo2GroupEditMaterialModule,
    GroupEditComponent,
    Kypo2GroupEditOverviewComponent,
    GroupEditControlsComponent,
    GroupRoleAssignComponent,
    GroupUserAssignComponent
  ],
})
export class Kypo2GroupEditComponentsModule {
}
