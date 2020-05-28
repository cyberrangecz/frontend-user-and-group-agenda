import { MetadataOverride } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KypoRequestedPagination } from 'kypo-common';
import { GroupApi, RoleApi, UserApi } from 'kypo-user-and-group-api';
import { UserAndGroupErrorHandler } from '../services/client/user-and-group-error-handler.service';
import { UserAndGroupNavigator } from '../services/client/user-and-group-navigator.service';
import { UserAndGroupNotificationService } from '../services/client/user-and-group-notification.service';
import { UserAndGroupContext } from '../services/shared/user-and-group-context.service';

export const KYPO_TABLE_COMPONENT_SELECTOR = 'kypo2-table';
export const KYPO_CONTROLS_COMPONENT_SELECTOR = 'kypo-controls';
export const KYPO_RESOURCE_SELECTOR_COMPONENT_SELECTOR = 'kypo2-resource-selector';

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
  ]);
}

export function createErrorHandlerSpy(): jasmine.SpyObj<UserAndGroupErrorHandler> {
  return jasmine.createSpyObj('UserAndGroupErrorHandler', ['emit']);
}

export function createPagination(): KypoRequestedPagination {
  return new KypoRequestedPagination(0, 5, '', '');
}

export function createKypoTableOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: KYPO_TABLE_COMPONENT_SELECTOR,
      inputs: ['hasError', 'defaultSortName', 'defaultSortDirection', 'data'],
      outputs: ['refresh', 'rowAction', 'rowSelection'],
    },
  };
}

export function createResourceSelectorOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: KYPO_RESOURCE_SELECTOR_COMPONENT_SELECTOR,
      inputs: ['searchPlaceholder', 'resources', 'selected', 'resourceMapping'],
      outputs: ['selectionChange', 'fetch'],
    },
  };
}

export function createKypoControlsOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: KYPO_CONTROLS_COMPONENT_SELECTOR,
      outputs: ['itemClicked'],
    },
  };
}
