# User and Group Management

**Current version: 1.1.0**

If you wish to use this library locally, you will need to run backend service as well. [Guide](https://gitlab.ics.muni.cz/kypo2/services-and-portlets/kypo2-user-and-group)

User and Group Management is a library with components and services to manage users, groups and roles in KYPO microservices.
It is developed to communicate with REST API of [KYPO2 User and Group Management service](https://gitlab.ics.muni.cz/kypo2/services-and-portlets/kypo2-user-and-group)

## Prerequisites

To use the library you need to have installed:

* NPM with private [KYPO Nexus repository](https://projects.ics.muni.cz/projects/kbase/knowledgebase/articles/153)
* Angular Material v8 or higher
* [Topology Graph Model library](https://gitlab.ics.muni.cz/kypo2/frontend-new/kypo2-angular-topology-model)

 
## Usage

To use the user and group management in your Angular application follow these steps:

1. Run `npm install kypo2-user-and-group-management`
2. Create topology config class extending **UserAndGroupManagementConfig** from the library. Config contains following options:
    + userAndGroupRestBasePath
    + defaultPaginationSize
3. Import **UserAndGroupManagementModule** from **kypo2-user-and-group-management** and add it to imports in your module with `UserAndGroupManagementModule.forRoot(UserAndGroupConfig)`.
4. Use `<kypo2-user-and-group-management>` element in your code.

## Developers

* Martin Hamernik (445720@mail.muni.cz)
