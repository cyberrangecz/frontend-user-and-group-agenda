/*
 * Public API Surface of user-and-group-management
 */

// GROUPS
export { GroupApi } from './lib/services/api/group/group-api.service';
export { GroupOverviewComponentsModule } from './lib/components/group/overview/group-overview-components.module';
export { GroupEditComponentsModule } from './lib/components/group/edit/group-edit-components.module';
export { GroupEditOverviewComponent } from './lib/components/group/edit/group-edit-overview.component';
export { GroupOverviewComponent } from './lib/components/group/overview/group-overview.component';
export { RoleAssignService } from './lib/services/role/role-assign.service';
export { GroupOverviewService } from './lib/services/group/group-overview.service';
export { GroupEditService } from './lib/services/group/group-edit.service';
export { GroupEditCanDeactivate } from './lib/services/can-deactivate/group-edit-can-deactivate.service';

// USERS
export { UserApi } from './lib/services/api/user/user-api.service';
export { UserComponentsModule } from './lib/components/user/user-components.module';
export { UserOverviewComponent } from './lib/components/user/overview/user-overview.component';
export { UserAssignService } from './lib/services/user/user-assign.service';
export { UserOverviewService } from './lib/services/user/user-overview.service';

// MICROSERVICES
export { MicroserviceEditComponentsModule } from './lib/components/microservice/microservice-edit-components.module';
export { MicroserviceApi } from './lib/services/api/microservice/microservice-api.service';
export { MicroserviceEditOverviewComponent } from './lib/components/microservice/microservice-edit-overview.component';
export { MicroserviceEditCanDeactivate } from './lib/services/can-deactivate/microservice-edit-can-deactivate.service';

// ROLES
export { RoleApi } from './lib/services/api/role/role-api.service';

// RESOLVERS
export * from './lib/services/resolvers/group-resolver.service';
export * from './lib/services/resolvers/group-title-resolver.service';
export * from './lib/services/resolvers/group-breadcrumb-resolver.service';

// CLIENT
export { UserAndGroupNotificationService } from './lib/services/client/user-and-group-notification.service';
export { UserAndGroupNavigator } from './lib/services/client/user-and-group-navigator.service';
export { UserAndGroupDefaultNavigator } from './lib/services/client/user-and-group-default-navigator.service';
export { UserAndGroupErrorHandler } from './lib/services/client/user-and-group-error-handler.service';
export { UserAndGroupConfig } from './lib/model/client/user-and-group-config';
export * from './lib/model/client/default-paths';
export * from './lib/model/client/activated-route-data-attributes';
