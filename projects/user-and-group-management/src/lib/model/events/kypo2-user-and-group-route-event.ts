/**
 * Event describing routing request between all pages supported by user and group library
 */
export class Kypo2UserAndGroupRouteEvent {
  resourceId?: number | string;
  resourceType: 'USER' | 'GROUP' | 'MICROSERVICE';
  actionType?: 'EDIT' | 'NEW' | 'DETAIL';
}
