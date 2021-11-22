import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { UserAndGroupAgendaConfig } from '@muni-kypo-crp/user-and-group-agenda';
import { SentinelTableModule } from '@sentinel/components/table';
import { PaginationService } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { GroupDetailMaterialModule } from './group-detail-material.module';
import { GroupDetailComponent } from './group-detail.component';
import { MembersDetailConcreteService } from '../services/members-detail-concrete.service';
import { MembersDetailService } from '../services/members-detail.service';
import { RolesDetailConcreteService } from '../services/roles-detail-concrete.service';
import { RolesDetailService } from '../services/roles-detail.service';
import { SentinelPipesModule } from '@sentinel/common';
import { RoleExpandComponent } from './role-expand/role-expand.component';

/**
 * Module containing component and providers for group detail page
 */
@NgModule({
  declarations: [GroupDetailComponent, RoleExpandComponent],
  imports: [CommonModule, GroupDetailMaterialModule, SentinelTableModule, SentinelPipesModule],
  providers: [
    PaginationService,
    { provide: MembersDetailService, useClass: MembersDetailConcreteService },
    { provide: RolesDetailService, useClass: RolesDetailConcreteService },
  ],
})
export class GroupDetailComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<GroupDetailComponentsModule> {
    return {
      ngModule: GroupDetailComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
