import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Kypo2UserMaterialModule} from './kypo2-user-material.module';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { UserControlsComponent } from './user-overview/user-controls/user-controls.component';
import {FormsModule} from '@angular/forms';
import {UserFacadeModule} from '../../services/facade/user/user-facade.module';
import {SharedModule} from '../shared/shared.module';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';
import {Kypo2TableModule} from 'kypo2-table';
import {UserOverviewService} from '../../services/user/user-overview.service';
import {UserOverviewConcreteService} from '../../services/user/user-overview-concrete.service';
import {UserDetailComponent} from './user-overview/user-detail/user-detail.component';

@NgModule({
  declarations: [
    UserOverviewComponent,
    UserDetailComponent,
    UserControlsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    Kypo2TableModule,
    Kypo2UserMaterialModule,
    UserFacadeModule,
    SharedModule
  ],
  providers: [
    { provide: UserOverviewService, useClass: UserOverviewConcreteService }
  ],
  entryComponents: [
    UserDetailComponent
  ],
  exports: [
    UserOverviewComponent
  ]
})
export class Kypo2UserModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2UserModule) {
    if (parentModule) {
      throw new Error(
        'UserModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2UserModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
