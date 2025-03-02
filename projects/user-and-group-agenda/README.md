# User and Group Agenda

User and Group Agenda is a library containing components and services to manage users, groups, microservices and roles in CyberRangeᶜᶻ Platform microservices.
It is developed as a frontend of [User and Group service](https://github.com/cyberrangecz/backend-user-and-group)

The library follows smart-dumb architecture. Smart components are exported from the library, and you can use them at your will. The project contains example implementation with lazy loading modules which you can use as an inspiration.
You can modify the behaviour of components by implementing abstract service class and injecting it through Angular dependency injection.

## Features

* Overview component and services for User
* Overview component and services for Group
* Create/Edit component and services for Group
* Create component and services for Microservice
* Default routing (overridable)
* Errors, notification, and navigation services
* CanDeactivate interface on all main components
* Resolvers for all main components

## Usage

To use the user and group management in your Angular application follow these steps:

1. Run `npm install @crczp/user-and-group-agenda`
2. Install all peer dependencies
3. Create config class extending `UserAndGroupAgendaConfig` from the library. Config contains following options:
    + defaultPaginationSize
4. Import specific modules containing components (for example `UserComponentsModule`) and provide config through `.forRoot()` method.
5. If you do not override the services, you will also need to provide API service. See [User and Group api](https://github.com/cyberrangecz/frontend-user-and-group-api).
6. You need to provide implementation of abstract services `ClientErrorHandlerService` and `ClientNotificationService` for error handling and notification displaying.
7. Optionally, you can override `UserAndGroupNavigator` service to provide custom navigation if you do not want to use default routes.
8. Optionally, cou can override and provide own implementation of services

For example, you would add `UserOverviewComponent` like this:

1. Create feature module `UserOverviewModule` containing all necessary imports and providers

```
@NgModule({
  imports: [
    CommonModule,
    UserOverviewRoutingModule,
    UserComponentsModule.forRoot(agendaConfig),
    UserAndGroupApiModule.forRoot(apiConfig),
  ],
  providers: [
    { provide: UserAndGroupErrorHandler, useClass: ClientErrorHandlerService },
    { provide: UserAndGroupNotificationService, useClass: ClientNotificationService },
  ],
})
export class UserOverviewModule {}
```

2. Create routing module importing the `UserOverviewModule`

```
const routes: Routes = [
  {
    path: '',
    component: UserOverviewComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserOverviewRoutingModule {}
```

3. Lazy load the module in the parent routing module

```
  {
    path: USER_PATH,
    loadChildren: () => import('./lazy-loaded-modules/user/user-overview.module').then((m) => m.UserOverviewModule)
  }
```
