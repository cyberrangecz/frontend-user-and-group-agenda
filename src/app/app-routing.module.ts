import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';
import { SentinelAuthProviderListComponent } from '@sentinel/auth/components';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
    canActivate: [SentinelAuthGuardWithLogin],
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
    component: SentinelAuthProviderListComponent,
    canActivate: [SentinelNegativeAuthGuard],
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
    canActivate: [SentinelAuthGuardWithLogin],
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
      initialNavigation: 'enabledNonBlocking',
    } as ExtraOptions),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
