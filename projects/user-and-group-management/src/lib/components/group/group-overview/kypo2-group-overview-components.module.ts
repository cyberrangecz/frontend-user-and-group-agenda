import {NgModule} from '@angular/core';
import {Kypo2GroupOverviewComponent} from './kypo2-group-overview.component';
import {GroupControlsComponent} from './group-controls/group-controls.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {Kypo2GroupOverviewMaterialModule} from './kypo2-group-overview-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Kypo2TableModule} from 'kypo2-table';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Kypo2GroupOverviewMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Kypo2TableModule,
  ],
  declarations: [
    Kypo2GroupOverviewComponent,
    GroupControlsComponent,
  ],
  exports: [
    Kypo2GroupOverviewMaterialModule,
    Kypo2GroupOverviewComponent,
    GroupControlsComponent,
  ]
})
export class Kypo2GroupOverviewComponentsModule {
}
