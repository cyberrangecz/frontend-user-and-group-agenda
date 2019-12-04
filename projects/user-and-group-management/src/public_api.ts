/*
 * Public API Surface of user-and-group-management
 */

export {UserAndGroupConfig} from './lib/config/user-and-group-config';

// GROUPS
export {Kypo2GroupOverviewModule} from './lib/components/group/group-overview/kypo2-group-overview.module';
export {Kypo2GroupOverviewComponentsModule} from './lib/components/group/group-overview/kypo2-group-overview-components.module';
export {Kypo2GroupEditModule} from './lib/components/group/group-edit-overview/kypo2-group-edit.module';
export {Kypo2GroupEditComponentsModule} from './lib/components/group/group-edit-overview/kypo2-group-edit-components.module';
export {Kypo2GroupEditOverviewComponent} from './lib/components/group/group-edit-overview/kypo2-group-edit-overview.component'
export {Kypo2GroupOverviewComponent} from './lib/components/group/group-overview/kypo2-group-overview.component';
export {Kypo2RoleAssignService} from './lib/services/role/kypo2-role-assign.service';
export {Kypo2GroupOverviewService} from './lib/services/group/kypo2-group-overview.service';
export {Kypo2GroupEditService} from './lib/services/group/kypo2-group-edit.service';
export {Kypo2GroupResolverHelperService} from './lib/services/group/kypo2-group-resolver-helper.service';
export {Kypo2GroupEditCanDeactivate} from './lib/services/group/kypo2-group-edit-can-deactivate.service';


// USERS
export {Kypo2UserModule} from './lib/components/user/kypo2-user.module';
export {Kypo2UserComponentsModule} from './lib/components/user/kypo2-user-components.module';
export {Kypo2UserOverviewComponent} from './lib/components/user/user-overview/kypo2-user-overview.component';
export {Kypo2UserAssignService} from './lib/services/user/kypo2-user-assign.service';
export {Kypo2UserOverviewService} from './lib/services/user/kypo2-user-overview.service';

// MICROSERVICES
export {Kypo2MicroserviceEditModule} from './lib/components/microservice/kypo2-microservice-edit.module';
export {Kypo2MicroserviceEditComponentsModule} from './lib/components/microservice/kypo2-microservice-edit-components.module';
export {Kypo2MicroserviceEditOverviewComponent} from './lib/components/microservice/kypo2-microservice-edit-overview.component';
export {Kypo2MicroserviceEditCanDeactivate} from './lib/services/microservice/kypo2-microservice-edit-can-deactivate.service';

// COMMONS
export {Kypo2UserAndGroupEventModule} from './lib/components/shared/kypo2-user-and-group-event.module';
export {Kypo2UserAndGroupNotificationService} from './lib/services/notification/kypo2-user-and-group-notification.service';
export {Kypo2UserAndGroupRoutingEventService} from './lib/services/routing/kypo2-user-and-group-routing-event.service';
export {Kypo2UserAndGroupErrorService} from './lib/services/notification/kypo2-user-and-group-error.service';
export {Kypo2UserAndGroupError} from './lib/model/events/kypo2-user-and-group-error';
export {Kypo2UserAndGroupNotification} from './lib/model/events/kypo2-user-and-group-notification';
export {Kypo2UserAndGroupNotificationType} from './lib/model/enums/kypo2-user-and-group-notification-type.enum';
export {Kypo2UserAndGroupRouteEvent} from './lib/model/events/kypo2-user-and-group-route-event';




