import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KypoControlsModule } from 'kypo-controls';
import { Kypo2TableModule } from 'kypo2-table';
import { UserAndGroupAgendaConfig } from '../../model/client/user-and-group-agenda-config';
import { UserAndGroupDefaultNavigator } from '../../services/client/user-and-group-default-navigator.service';
import { UserAndGroupNavigator } from '../../services/client/user-and-group-navigator.service';
import { UserOverviewConcreteService } from '../../services/user/user-overview-concrete.service';
import { UserOverviewService } from '../../services/user/user-overview.service';
import { InternalSharedModule } from '../shared/internal-shared.module';
import { UserDetailComponent } from './overview/detail/user-detail.component';
import { UserOverviewComponent } from './overview/user-overview.component';
import { UserMaterialModule } from './user-material.module';

/**
 * Module containing declarations and necessary imports for user related components
 */
@NgModule({
  declarations: [UserOverviewComponent, UserDetailComponent],
  imports: [CommonModule, FormsModule, Kypo2TableModule, UserMaterialModule, InternalSharedModule, KypoControlsModule],
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
