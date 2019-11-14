import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kypo2GroupMaterialModule } from './kypo2-group-material.module';
import { GroupOverviewComponent } from './group-overview/group-overview.component';
import { GroupControlsComponent } from './group-overview/group-controls/group-controls.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupFacadeModule } from '../../services/facade/group/group-facade.module';
import { UserFacadeModule } from '../../services/facade/user/user-facade.module';
import { RoleFacadeModule } from '../../services/facade/role/role-facade.module';
import { SharedModule } from '../shared/shared.module';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';
import {Kypo2TableModule} from 'kypo2-table';
import {GroupOverviewService} from '../../services/group/group-overview.service';
import {GroupOverviewConcreteService} from '../../services/group/group-overview.concrete.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Kypo2GroupMaterialModule,
    FormsModule,
    GroupFacadeModule,
    UserFacadeModule,
    RoleFacadeModule,
    ReactiveFormsModule,
    Kypo2TableModule
  ],
  declarations: [
    GroupOverviewComponent,
    GroupControlsComponent,
  ],
  providers: [
    {provide: GroupOverviewService, useClass: GroupOverviewConcreteService},
  ],
  exports: [
    GroupOverviewComponent
  ]
})
export class Kypo2GroupModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2GroupModule) {
    if (parentModule) {
      throw new Error(
        'GroupModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2GroupModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
