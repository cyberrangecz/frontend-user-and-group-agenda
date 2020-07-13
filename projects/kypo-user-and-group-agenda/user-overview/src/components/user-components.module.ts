import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SentinelControlsModule } from '@sentinel/components/controls';
import { SentinelTableModule } from '@sentinel/components/table';
import {
  UserAndGroupNavigator,
  UserAndGroupDefaultNavigator,
  UserAndGroupAgendaConfig,
} from 'kypo-user-and-group-agenda';
import { UserOverviewConcreteService } from '../services/overview/user-overview-concrete.service';
import { UserOverviewService } from '../services/overview/user-overview.service';
import { InternalSharedModule } from 'kypo-user-and-group-agenda/internal';
import { UserDetailComponent } from './detail/user-detail.component';
import { UserOverviewComponent } from './user-overview.component';
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
