export class Kypo2UserAndGroupRouteEvent {
  resourceId?: number | string;
  resourceType: 'USER' | 'GROUP' | 'MICROSERVICE';
  actionType?: 'EDIT' | 'NEW' | 'DETAIL';
}
