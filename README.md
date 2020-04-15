# User and Group Management


If you wish to use this library locally, you will need to run backend service as well. [Guide](https://gitlab.ics.muni.cz/kypo2/services-and-portlets/kypo2-user-and-group)

User and Group Management is a library containing components and services to manage users, groups, microservices and roles in KYPO microservices.
It is developed to communicate with REST API of [KYPO2 User and Group Management service](https://gitlab.ics.muni.cz/kypo2/services-and-portlets/kypo2-user-and-group)

## Features

* Overview component and services for User
* Overview component and services for Group
* Create/Edit component and services for Group
* Create component and services for Microservice
* Errors, notification and routing requests emitted through shared service
* API services and services integrating components with API.
* CanDeactivate interface on all main components

You can use the components and services as they are import only "components" modules and alter its behaviour.

## Prerequisites

To use the library you need to have installed:

* NPM with private [KYPO Nexus repository](https://projects.ics.muni.cz/projects/kbase/knowledgebase/articles/153)
* Angular Material 8
* [kypo2-auth](https://gitlab.ics.muni.cz/kypo2/frontend-new/kypo2-auth)
* [kypo2-table](https://gitlab.ics.muni.cz/kypo2/frontend-new/kypo2-table)
* [kypo2-user-assign](https://gitlab.ics.muni.cz/kypo2/frontend-new/kypo2-user-assign)
* [typescript-collections](https://www.npmjs.com/package/typescript-collections)

## Usage

To use the user and group management in your Angular application follow these steps:

1. Run `npm install kypo2-user-and-group-management`
1. Create topology config class extending **UserAndGroupManagementConfig** from the library. Config contains following options:
    + userAndGroupRestBasePath
    + defaultPaginationSize
1. Import **Kypo2GroupOverviewModule**, **Kypo2MicroserviceEditModule** and **Kypo2UserModule** with `forRoot(userAndGroupConfig)` method in desired modules (routing and lazy-loaded modules are recommended). 
1. Provide necessary resolvers (as of now, only Group resolver is required)
1. Subscribe to observables of `UserAndGroupErrorService`, `UserAndGroupNotificationService` and `Kypo2UserAndGroupRoutingEventService` to handle events emitted by libary in your app

**NOTE:** The library is implemented with Angular best practices in mind and detail components (GroupEdit) are expecting to get data from ActivatedRoute service. You need to implement and provide your own GroupResolver service. You can use `Kypo2GroupResolverHelperService` to get the data by id. You are expected to store the data in `.activeRoute.data.group`

## Example

To see the library in work and to see example of integration of the library with your app, you can run the example app.
To run the example you need to run [KYPO2 User and Group Management service](https://gitlab.ics.muni.cz/kypo2/services-and-portlets/kypo2-user-and-group) or have access to a running instance and provide the URL to the service in `UserAndGroupConfig`. Optionally, you can run mock service as [json-server](https://www.npmjs.com/package/json-server).

1. Clone this repository
1. Run `npm install`
1. Run `ng serve --ssl`
1. See the app at `https://localhost:4200`



## Developers

* Martin Hamernik (445720@mail.muni.cz)
