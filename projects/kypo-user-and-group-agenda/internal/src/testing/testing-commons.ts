import { MetadataOverride } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RequestedPagination } from '@sentinel/common';
import { GroupApi, RoleApi, UserApi, MicroserviceApi } from '@muni-kypo-crp/user-and-group-api';
import { UserAndGroupErrorHandler } from '../../../src/user-and-group-error-handler.service';
import { UserAndGroupNavigator } from '../../../src/user-and-group-navigator.service';
import { UserAndGroupNotificationService } from '../../../src/user-and-group-notification.service';
import { UserAndGroupContext } from '../services/user-and-group-context.service';

export const SENTINEL_TABLE_COMPONENT_SELECTOR = 'sentinel-table';
export const SENTINEL_CONTROLS_COMPONENT_SELECTOR = 'sentinel-controls';
export const SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR = 'sentinel-resource-selector';

export function createGroupApiSpy(): jasmine.SpyObj<GroupApi> {
  return jasmine.createSpyObj('GroupApi', [
    'get',
    'getAll',
    'deleteMultiple',
    'create',
    'update',
    'addUsersToGroup',
    'removeUsersFromGroup',
    'assignRole',
    'removeRole',
    'getRolesOfGroup',
  ]);
}

export function createUserApiSpy(): jasmine.SpyObj<UserApi> {
  return jasmine.createSpyObj('UserApi', [
    'getAll',
    'deleteMultiple',
    'create',
    'update',
    'getUsersNotInGroup',
    'getUsersInGroups',
  ]);
}

export function createRoleApiSpy(): jasmine.SpyObj<RoleApi> {
  return jasmine.createSpyObj('RoleApi', ['getAll']);
}

export function createMicroserviceApiSpy(): jasmine.SpyObj<MicroserviceApi> {
  return jasmine.createSpyObj('MicroserviceApi', ['getAll', 'register']);
}

export function createRouterSpy(): jasmine.SpyObj<Router> {
  return jasmine.createSpyObj('Router', ['navigate']);
}

export function createNotificationSpy(): jasmine.SpyObj<UserAndGroupNotificationService> {
  return jasmine.createSpyObj('UserAndGroupNotificationService', ['emit']);
}

export function createMatDialogSpy(): jasmine.SpyObj<MatDialog> {
  return jasmine.createSpyObj('MatDialog', ['open']);
}

export function createContextSpy(): jasmine.SpyObj<UserAndGroupContext> {
  return jasmine.createSpyObj('KypoUserAndGroupContext', ['config']);
}

export function createNavigatorSpy(): jasmine.SpyObj<UserAndGroupNavigator> {
  return jasmine.createSpyObj('UserAndGroupNavigator', [
    'toNewGroup',
    'toGroupEdit',
    'toGroupOverview',
    'toUserOverview',
    'toNewMicroservice',
  ]);
}

export function createErrorHandlerSpy(): jasmine.SpyObj<UserAndGroupErrorHandler> {
  return jasmine.createSpyObj('UserAndGroupErrorHandler', ['emit']);
}

export function createPagination(): RequestedPagination {
  return new RequestedPagination(0, 5, '', '');
}

export function createSentinelOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: SENTINEL_TABLE_COMPONENT_SELECTOR,
      inputs: ['hasError', 'defaultSortName', 'defaultSortDirection', 'data'],
      outputs: ['refresh', 'rowAction', 'rowSelection'],
    },
  };
}

export function createResourceSelectorOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR,
      inputs: ['searchPlaceholder', 'resources', 'selected', 'resourceMapping'],
      outputs: ['selectionChange', 'fetch'],
    },
  };
}

export function createSentinelControlsOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: SENTINEL_CONTROLS_COMPONENT_SELECTOR,
      outputs: ['itemClicked'],
    },
  };
}
