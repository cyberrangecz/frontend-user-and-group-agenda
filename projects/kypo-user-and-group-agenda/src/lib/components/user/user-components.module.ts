import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import { UserAndGroupAgendaConfig } from '../../model/client/user-and-group-agenda-config';
import { UserAndGroupDefaultNavigator } from '../../services/client/user-and-group-default-navigator.service';
import { UserAndGroupNavigator } from '../../services/client/user-and-group-navigator.service';
import { UserOverviewConcreteService } from '../../services/user/overview/user-overview-concrete.service';
import { UserOverviewService } from '../../services/user/overview/user-overview.service';
import { InternalSharedModule } from '../shared/internal-shared.module';
import { UserDetailComponent } from './overview/detail/user-detail.component';
import { UserOverviewComponent } from './overview/user-overview.component';
import { UserMaterialModule } from './user-material.module';

/**
 * Module containing declarations and necessary imports for user related components
 */
@NgModule({
  declarations: [UserOverviewComponent, UserDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    SentinelTableModule,
    UserMaterialModule,
    InternalSharedModule,
    SentinelControlsModule,
  ],
  exports: [UserMaterialModule, UserOverviewComponent, UserDetailComponent],
  providers: [
    { provide: UserOverviewService, useClass: UserOverviewConcreteService },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator },
  ],
})
export class UserComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<UserComponentsModule> {
    return {
      ngModule: UserComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
