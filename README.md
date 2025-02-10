# User and Group Agenda

User and Group Agenda is a library containing components and services to manage users, groups, microservices and roles in CyberRangeᶜᶻ Platform microservices.
It is developed as a frontend of [User and Group Service](https://github.com/cyberrangecz/backend-user-and-group)

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

1. Run `npm install @cyberrangecz-platform/user-and-group-agenda`
1. Install all peer dependencies
1. Create config class extending `UserAndGroupAgendaConfig` from the library. Config contains following options:
    + defaultPaginationSize
1. Import specific modules containing components (for example `UserComponentsModule`) and provide config through `.forRoot()` method.
1. If you do not override the services, you will also need to provide API service. See [@cyberrangecz-platform/user-and-group-api library](LINK-HERE).
1. You need to provide implementation of abstract services `ClientErrorHandlerService` and `ClientNotificationService` for error handling and notification displaying.
1. Optionally, you can override `UserAndGroupNavigator` service to provide custom navigation if you do not want to use default routes.
1. Optionally, cou can override and provide own implementation of services

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

1. Create routing module importing the `UserOverviewModule`

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

1. Lazy load the module in the parent routing module

```
  {
    path: USER_PATH,
    loadChildren: () => import('./lazy-loaded-modules/user/user-overview.module').then((m) => m.UserOverviewModule)
  }
```

## Example

To see the library in work and to see example setup, you can run the example app.
To run the example you need to run [User and Group Service](https://github.com/cyberrangecz/backend-user-and-group) or have access to a running instance and provide the URL to the service in when importing API module.

Alternatively, you can run a json-server, which provides an example mocked DB with necessary endpoints. It is located in the [Training portal](LINK-HERE) project and can be run via `npm run api`.

1. Clone this repository
1. Run `npm install`
1. Run `ng serve --ssl`
1. See the app at `https://localhost:4200`
