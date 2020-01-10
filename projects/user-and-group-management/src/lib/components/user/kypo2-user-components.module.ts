import {NgModule} from '@angular/core';
import {Kypo2UserOverviewComponent} from './user-overview/kypo2-user-overview.component';
import {UserDetailComponent} from './user-overview/user-detail/user-detail.component';
import {UserControlsComponent} from './user-overview/user-controls/user-controls.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Kypo2TableModule} from 'kypo2-table';
import {Kypo2UserMaterialModule} from './kypo2-user-material.module';
import {InternalSharedModule} from '../shared/internal-shared.module';

/**
 * Module containing declarations and necessary imports for user related components
 */
@NgModule({
  declarations: [
    Kypo2UserOverviewComponent,
    UserDetailComponent,
    UserControlsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    Kypo2TableModule,
    Kypo2UserMaterialModule,
    InternalSharedModule
  ],
  entryComponents: [
    UserDetailComponent
  ],
  exports: [
    Kypo2UserMaterialModule,
    Kypo2UserOverviewComponent,
    UserDetailComponent,
    UserControlsComponent,
  ]
})
export class Kypo2UserComponentsModule {
}
