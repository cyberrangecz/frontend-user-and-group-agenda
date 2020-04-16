import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MicroserviceEditCanDeactivate,
  MicroserviceEditOverviewComponent,
} from '../../../../../projects/user-and-group-management/src/public_api';

const routes: Routes = [
  {
    path: '',
    component: MicroserviceEditOverviewComponent,
    canDeactivate: [MicroserviceEditCanDeactivate],
  },
];

/**
 * Routing module training definition overview
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MicroserviceNewRoutingModule {}
