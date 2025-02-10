import { MICROSERVICE_NEW_PATH } from '../../../../projects/user-and-group-agenda/src/default-paths';
import {
    MicroserviceOverviewComponent
} from '../../../../projects/user-and-group-agenda/microservice-overview/src/components/microservice-overview.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: MicroserviceOverviewComponent,
    },
    {
        path: MICROSERVICE_NEW_PATH,
        loadChildren: () => import('./new/microservice-new.module').then((m) => m.MicroserviceNewModule),
        data: {
            breadcrumb: 'Registration',
            title: 'Microservice Registration',
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
export class MicroserviceOverviewRoutingModule {
}
