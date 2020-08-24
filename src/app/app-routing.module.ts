import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { Kypo2AuthGuardWithLogin, Kypo2AuthProviderPickerComponent, Kypo2NotAuthGuardService } from 'kypo2-auth';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
    canActivate: [Kypo2AuthGuardWithLogin],
  },
  {
    path: 'group',
    loadChildren: () => import('./lazy-loaded-modules/group/group-overview.module').then((m) => m.GroupOverviewModule),
    data: {
      breadcrumb: 'Group',
      title: 'Group Overview',
    },
  },
  {
    path: 'user',
    loadChildren: () => import('./lazy-loaded-modules/user/user-overview.module').then((m) => m.UserOverviewModule),
    data: {
      breadcrumb: 'User',
      title: 'User Overview',
    },
  },
  {
    path: 'microservice',
    loadChildren: () =>
      import('./lazy-loaded-modules/microservice/microservice-overview.module').then(
        (m) => m.MicroserviceOverviewModule
      ),
    data: {
      breadcrumb: 'Microservice',
      title: 'Microservice Overview',
    },
  },
  {
    path: 'login',
    component: Kypo2AuthProviderPickerComponent,
    canActivate: [Kypo2NotAuthGuardService],
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications/notifications-overview.module').then((m) => m.NotificationsOverviewModule),
    data: { breadcrumb: 'Notifications' },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [Kypo2AuthGuardWithLogin],
  },
  {
    path: 'logout-confirmed',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: true,
    } as ExtraOptions),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
