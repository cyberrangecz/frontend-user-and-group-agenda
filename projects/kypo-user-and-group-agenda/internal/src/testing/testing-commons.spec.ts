import { MetadataOverride } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OffsetPaginationEvent } from '@sentinel/common/pagination';
import { GroupApi, MicroserviceApi, RoleApi, UserApi } from '@cyberrangecz-platform/user-and-group-api';
import { UserAndGroupErrorHandler } from '../../../src/user-and-group-error-handler.service';
import { UserAndGroupNavigator } from '../../../src/user-and-group-navigator.service';
import { UserAndGroupNotificationService } from '../../../src/user-and-group-notification.service';
import { UserAndGroupContext } from '../services/user-and-group-context.service';
import { PaginationService } from '../services/pagination.service';
import { FileUploadProgressService } from '../../../user-overview/src/services/file-upload/file-upload-progress.service';

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
  return jasmine.createSpyObj('RoleApi', ['getAll', 'getRolesNotInGroup']);
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

export function createPaginationServiceSpy(): jasmine.SpyObj<PaginationService> {
  return jasmine.createSpyObj('PaginationService', ['setPagination', 'getPagination']);
}

export function createNavigatorSpy(): jasmine.SpyObj<UserAndGroupNavigator> {
  return jasmine.createSpyObj('UserAndGroupNavigator', [
    'toNewGroup',
    'toGroupEdit',
    'toGroupDetail',
    'toGroupOverview',
    'toUserOverview',
    'toUserDetail',
    'toNewMicroservice',
  ]);
}

export function createErrorHandlerSpy(): jasmine.SpyObj<UserAndGroupErrorHandler> {
  return jasmine.createSpyObj('UserAndGroupErrorHandler', ['emit']);
}

export function createPagination(): OffsetPaginationEvent {
  return new OffsetPaginationEvent(0, 5, '', 'asc');
}

export function createSentinelOverride(): MetadataOverride<any> {
  return {
    set: {
      selector: SENTINEL_TABLE_COMPONENT_SELECTOR,
      inputs: [
        'hasError',
        'defaultSortName',
        'defaultSortDirection',
        'data',
        'preselected',
        'totalElements',
        'showMoreDefaultSize',
      ],
      outputs: ['refresh', 'rowAction', 'rowSelection', 'rowClick', 'tableLoad'],
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

export function createDialogRefSpy(): jasmine.SpyObj<MatDialogRef<any>> {
  return jasmine.createSpyObj(MatDialogRef, ['open', 'close']);
}

export function createFileUploadProgressServiceSpy(): jasmine.SpyObj<FileUploadProgressService> {
  return jasmine.createSpyObj('FileUploadProgressService', ['start', 'finish']);
}
