import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  GroupBreadcrumbResolver,
  GroupOverviewComponent,
  GroupResolver,
  GroupTitleResolver,
} from '@kypo/user-and-group-agenda/group-overview';
import {
  GROUP_DATA_ATTRIBUTE_NAME,
  GROUP_EDIT_PATH,
  GROUP_NEW_PATH,
  GROUP_SELECTOR,
} from '@kypo/user-and-group-agenda';

const routes: Routes = [
  {
    path: '',
    component: GroupOverviewComponent,
  },
  {
    path: GROUP_NEW_PATH,
    loadChildren: () => import('./edit/group-edit.module').then((m) => m.GroupEditModule),
    resolve: {
      [GROUP_DATA_ATTRIBUTE_NAME]: GroupResolver,
      breadcrumb: GroupBreadcrumbResolver,
      title: GroupTitleResolver,
    },
  },
  {
    path: `:${GROUP_SELECTOR}/${GROUP_EDIT_PATH}`,
    loadChildren: () => import('./edit/group-edit.module').then((m) => m.GroupEditModule),
    resolve: {
      [GROUP_DATA_ATTRIBUTE_NAME]: GroupResolver,
      breadcrumb: GroupBreadcrumbResolver,
      title: GroupTitleResolver,
    },
  },
];

/**
 * Routing module training definition overview
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupOverviewRoutingModule {}
