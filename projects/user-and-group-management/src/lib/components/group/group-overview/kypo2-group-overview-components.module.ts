import {NgModule} from '@angular/core';
import {Kypo2GroupOverviewComponent} from './kypo2-group-overview.component';
import {CommonModule} from '@angular/common';
import {InternalSharedModule} from '../../shared/internal-shared.module';
import {Kypo2GroupOverviewMaterialModule} from './kypo2-group-overview-material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Kypo2TableModule} from 'kypo2-table';
import {KypoControlsModule} from 'kypo-controls';

/**
 * Module containing components and necessary imports for group overview page
 */
@NgModule({
    imports: [
        CommonModule,
        InternalSharedModule,
        Kypo2GroupOverviewMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        Kypo2TableModule,
        KypoControlsModule,
    ],
  declarations: [
    Kypo2GroupOverviewComponent,
  ],
  exports: [
    Kypo2GroupOverviewMaterialModule,
    Kypo2GroupOverviewComponent,
  ]
})
export class Kypo2GroupOverviewComponentsModule {
}
