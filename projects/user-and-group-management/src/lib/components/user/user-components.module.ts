import {ModuleWithProviders, NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Kypo2TableModule} from 'kypo2-table';
import {UserMaterialModule} from './user-material.module';
import {InternalSharedModule} from '../shared/internal-shared.module';
import {KypoControlsModule} from 'kypo-controls';
import {UserApi} from '../../services/api/user/user-api.service';
import {UserDefaultApi} from '../../services/api/user/user-default-api.service';
import {UserOverviewService} from '../../services/user/user-overview.service';
import {UserOverviewConcreteService} from '../../services/user/user-overview-concrete.service';
import {UserAndGroupConfig} from '../../model/client/user-and-group-config';
import {UserDetailComponent} from './overview/detail/user-detail.component';
import {UserOverviewComponent} from './overview/user-overview.component';
import {UserAndGroupNavigator} from '../../services/client/user-and-group-navigator.service';
import {UserAndGroupDefaultNavigator} from '../../services/client/user-and-group-default-navigator.service';

/**
 * Module containing declarations and necessary imports for user related components
 */
@NgModule({
  declarations: [
    UserOverviewComponent,
    UserDetailComponent,
  ],
  imports: [
      CommonModule,
      FormsModule,
      Kypo2TableModule,
      UserMaterialModule,
      InternalSharedModule,
      KypoControlsModule
  ],
  exports: [
    UserMaterialModule,
    UserOverviewComponent,
    UserDetailComponent,
  ],
  providers: [
    { provide: UserApi, useClass: UserDefaultApi },
    { provide: UserOverviewService, useClass: UserOverviewConcreteService },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator }
  ]
})
export class UserComponentsModule {
  static forRoot(config: UserAndGroupConfig): ModuleWithProviders<UserComponentsModule> {
    return {
      ngModule: UserComponentsModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
