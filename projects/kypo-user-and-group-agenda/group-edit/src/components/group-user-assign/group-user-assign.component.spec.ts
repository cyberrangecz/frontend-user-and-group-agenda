// import { SimpleChange } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { PaginatedResource, OffsetPagination } from '@sentinel/common';
// import { SentinelControlsComponent } from '@sentinel/components/controls';
// import { Group, User } from '@muni-kypo-crp/user-and-group-model';
// import { SentinelTableComponent, TableLoadEvent, TableActionEvent } from '@sentinel/components/table';
// import { SentinelResourceSelectorComponent } from '@sentinel/components/resource-selector';
// import { EMPTY, of } from 'rxjs';
// import { PaginationService, UserDeleteAction } from '@muni-kypo-crp/user-and-group-agenda/internal';
// import { DeleteControlItem } from '@muni-kypo-crp/user-and-group-agenda/internal';
// import { SaveControlItem } from '@muni-kypo-crp/user-and-group-agenda/internal';
// import { UserAndGroupContext } from '@muni-kypo-crp/user-and-group-agenda/internal';
// import { GroupEditService, UserAssignService } from '@muni-kypo-crp/user-and-group-agenda/group-edit';
// import {
//   createContextSpy,
//   createSentinelControlsOverride,
//   createSentinelOverride,
//   createPagination,
//   createResourceSelectorOverride,
//   SENTINEL_TABLE_COMPONENT_SELECTOR,
//   createPaginationServiceSpy,
//   createGroupApiSpy,
//   createRouterSpy,
//   createNavigatorSpy,
//   createErrorHandlerSpy,
//   createNotificationSpy,
//   createUserApiSpy,
// } from '../../../../internal/src/testing/testing-commons.spec';
// import { GroupEditMaterialModule } from '../group-edit-material.module';
// import { GroupUserAssignComponent } from './group-user-assign.component';
// import { GroupApi, UserApi } from '@muni-kypo-crp/user-and-group-api';
// import { Router } from '@angular/router';
// import {
//   UserAndGroupErrorHandler,
//   UserAndGroupNavigator,
//   UserAndGroupNotificationService,
// } from '@muni-kypo-crp/user-and-group-agenda';

// describe('GroupUserAssignComponent', () => {
//   let component: GroupUserAssignComponent;
//   let fixture: ComponentFixture<GroupUserAssignComponent>;
//   let paginationServiceSpy: jasmine.SpyObj<PaginationService>;
//   let userAssignService: jasmine.SpyObj<UserAssignService>;
//   let contextSpy: jasmine.SpyObj<UserAndGroupContext>;

//   let apiSpy: jasmine.SpyObj<GroupApi>;
//   let userApiSpy: jasmine.SpyObj<UserApi>;
//   let routerSpy: jasmine.SpyObj<Router>;
//   let notificationSpy: jasmine.SpyObj<UserAndGroupNotificationService>;
//   let navigatorSpy: jasmine.SpyObj<UserAndGroupNavigator>;
//   let errorHandlerSpy: jasmine.SpyObj<UserAndGroupErrorHandler>;

//   beforeEach(async(() => {
//     const testUsers = createUserResource();
//     const testGroups = createGroupResource();
//     contextSpy = createContextSpy();
//     paginationServiceSpy = createPaginationServiceSpy();
//     apiSpy = createGroupApiSpy();
//     userApiSpy = createUserApiSpy();
//     routerSpy = createRouterSpy();
//     navigatorSpy = createNavigatorSpy();
//     errorHandlerSpy = createErrorHandlerSpy();
//     notificationSpy = createNotificationSpy();
//     userAssignService = jasmine.createSpyObj([
//       'getUsersToAssign',
//       'getGroupsToImport',
//       'getAssigned',
//       'assign',
//       'assignSelected',
//       'unassign',
//       'unassignSelected',
//       'setSelectedUsersToAssign',
//       'clearSelectedUsersToAssign',
//       'setSelectedAssignedUsers',
//       'clearSelectedAssignedUsers',
//       'setSelectedGroupsToImport',
//       'clearSelectedGroupsToImport',
//     ]);
//     userAssignService.getAssigned.and.returnValue(of(testUsers));
//     userAssignService.assignedUsers$ = of(testUsers);
//     userAssignService.selectedAssignedUsers$ = of(testUsers.elements);
//     userAssignService.selectedUsersToAssign$ = of(testUsers.elements);
//     userAssignService.selectedGroupsToImport$ = of(testGroups.elements);

//     TestBed.configureTestingModule({
//       imports: [GroupEditMaterialModule],
//       declarations: [GroupUserAssignComponent],
//       providers: [
//         { provide: GroupApi, useValue: apiSpy },
//         { provide: UserApi, useValue: userApiSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: UserAndGroupNavigator, useValue: navigatorSpy },
//         { provide: UserAndGroupErrorHandler, useValue: errorHandlerSpy },
//         { provide: UserAndGroupNotificationService, useValue: notificationSpy },
//         { provide: UserAndGroupContext, useValue: contextSpy },
//         { provide: UserAssignService, useValue: userAssignService },
//         { provide: PaginationService, useValue: paginationServiceSpy },
//       ],
//     })
//       .overrideComponent(SentinelControlsComponent, createSentinelControlsOverride())
//       .overrideComponent(SentinelTableComponent, createSentinelOverride())
//       .overrideComponent(SentinelResourceSelectorComponent, createResourceSelectorOverride())
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(GroupUserAssignComponent);
//     component = fixture.componentInstance;
//     const group = new Group();
//     group.id = 1;
//     component.resource = group;
//     component.ngOnChanges({ resource: new SimpleChange(undefined, group, true) });
//     fixture.detectChanges();
//   });

//   /**
//    * TODO repair tests for this component - currently failing because edit service is now provided by component
//    */
//   // it('should create', () => {
//   //   expect(component).toBeTruthy();
//   // });
//   //
//   // it('should init', () => {
//   //   expect(component.assignUsersControls).toBeTruthy();
//   //   expect(component.assignUsersControls.length).toBeGreaterThan(0);
//   //   expect(component.assignedUsersControls).toBeTruthy();
//   //   expect(component.assignedUsersControls.length).toBeGreaterThan(0);
//   //   expect(component.assignedUsers$).toBeTruthy();
//   //   expect(userAssignService.getAssigned).toHaveBeenCalledTimes(1);
//   // });
//   //
//   // it('should call service on search users', () => {
//   //   userAssignService.getUsersToAssign.and.returnValue(of(createUserResource()));
//   //   expect(userAssignService.getUsersToAssign).toHaveBeenCalledTimes(0);
//   //   const filterValue = 'test filter';
//   //
//   //   component.searchUsers(filterValue);
//   //
//   //   expect(userAssignService.getUsersToAssign).toHaveBeenCalledTimes(1);
//   //   expect(userAssignService.getUsersToAssign).toHaveBeenCalledWith(jasmine.anything(), filterValue);
//   // });
//   //
//   // it('should call service on search groups', () => {
//   //   userAssignService.getGroupsToImport.and.returnValue(of(createGroupResource()));
//   //   expect(userAssignService.getGroupsToImport).toHaveBeenCalledTimes(0);
//   //   const filterValue = 'test filter';
//   //
//   //   component.searchGroups(filterValue);
//   //
//   //   expect(userAssignService.getGroupsToImport).toHaveBeenCalledTimes(1);
//   //   expect(userAssignService.getGroupsToImport).toHaveBeenCalledWith(filterValue);
//   // });
//   //
//   // it('should call service on users to assign selection', () => {
//   //   expect(userAssignService.setSelectedUsersToAssign).toHaveBeenCalledTimes(0);
//   //   const expectedUsers = [new User()];
//   //
//   //   component.onUserToAssignSelection(expectedUsers);
//   //
//   //   expect(userAssignService.setSelectedUsersToAssign).toHaveBeenCalledTimes(1);
//   //   expect(userAssignService.setSelectedUsersToAssign).toHaveBeenCalledWith(expectedUsers);
//   // });
//   //
//   // it('should call service on groups to import selection', () => {
//   //   expect(userAssignService.setSelectedGroupsToImport).toHaveBeenCalledTimes(0);
//   //   const expectedGroups = [new Group()];
//   //
//   //   component.onGroupToImportSelection(expectedGroups);
//   //
//   //   expect(userAssignService.setSelectedGroupsToImport).toHaveBeenCalledTimes(1);
//   //   expect(userAssignService.setSelectedGroupsToImport).toHaveBeenCalledWith(expectedGroups);
//   // });
//   //
//   // it('should call service on assigned users selection', () => {
//   //   expect(userAssignService.setSelectedAssignedUsers).toHaveBeenCalledTimes(0);
//   //   const expectedUsers = [new User()];
//   //
//   //   component.onAssignedUsersSelection(expectedUsers);
//   //
//   //   expect(userAssignService.setSelectedAssignedUsers).toHaveBeenCalledTimes(1);
//   //   expect(userAssignService.setSelectedAssignedUsers).toHaveBeenCalledWith(expectedUsers);
//   // });
//   //
//   // it('should call service on assigned users load', () => {
//   //   userAssignService.getAssigned.and.returnValue(of(createUserResource()));
//   //   expect(userAssignService.getAssigned).toHaveBeenCalledTimes(1);
//   //   const expectedLoadEvent = new TableLoadEvent(createPagination(), 'some filter');
//   //
//   //   component.onAssignedLoadEvent(expectedLoadEvent);
//   //
//   //   expect(userAssignService.getAssigned).toHaveBeenCalledTimes(2);
//   //   expect(userAssignService.getAssigned).toHaveBeenCalledWith(
//   //     jasmine.anything(),
//   //     expectedLoadEvent.pagination,
//   //     expectedLoadEvent.filter
//   //   );
//   // });
//   //
//   // it('should call service on save control of users to assign controls', () => {
//   //   userAssignService.assignSelected.and.returnValue(of(true));
//   //   expect(userAssignService.assignSelected).toHaveBeenCalledTimes(0);
//   //   const controlItem = component.assignUsersControls.find((control) => control.id === SaveControlItem.ID);
//   //   component.onControlAction(controlItem);
//   //
//   //   expect(userAssignService.assignSelected).toHaveBeenCalledTimes(1);
//   // });
//   //
//   // it('should call service on delete control of assigned users controls', () => {
//   //   userAssignService.unassignSelected.and.returnValue(of(true));
//   //   expect(userAssignService.unassignSelected).toHaveBeenCalledTimes(0);
//   //   const controlItem = component.assignedUsersControls.find((control) => control.id === DeleteControlItem.ID);
//   //   component.onControlAction(controlItem);
//   //
//   //   expect(userAssignService.unassignSelected).toHaveBeenCalledTimes(1);
//   // });
//   //
//   // it('should display user selector component', () => {
//   //   const selectorEl = fixture.debugElement.query(By.css('.user-selector'));
//   //   expect(selectorEl).toBeTruthy();
//   // });
//   //
//   // it('should call method on user selector selection event', () => {
//   //   spyOn(component, 'onUserToAssignSelection');
//   //   expect(component.onUserToAssignSelection).toHaveBeenCalledTimes(0);
//   //   const expectedSelection = createUserResource().elements;
//   //
//   //   const selectorEl = fixture.debugElement.query(By.css('.user-selector'));
//   //   selectorEl.triggerEventHandler('selectionChange', expectedSelection);
//   //
//   //   expect(component.onUserToAssignSelection).toHaveBeenCalledTimes(1);
//   //   expect(component.onUserToAssignSelection).toHaveBeenCalledWith(expectedSelection);
//   // });
//   //
//   // it('should call method on user selector fetch event', () => {
//   //   spyOn(component, 'searchUsers');
//   //   expect(component.searchUsers).toHaveBeenCalledTimes(0);
//   //   const expectedSearchValue = 'test value';
//   //
//   //   const selectorEl = fixture.debugElement.query(By.css('.user-selector'));
//   //   selectorEl.triggerEventHandler('fetch', expectedSearchValue);
//   //
//   //   expect(component.searchUsers).toHaveBeenCalledTimes(1);
//   //   expect(component.searchUsers).toHaveBeenCalledWith(expectedSearchValue);
//   // });
//   //
//   // it('should display group-overview selector component', () => {
//   //   const selectorEl = fixture.debugElement.query(By.css('.group-selector'));
//   //   expect(selectorEl).toBeTruthy();
//   // });
//   //
//   // it('should call method on group-overview selector selection event', () => {
//   //   spyOn(component, 'onGroupToImportSelection');
//   //   expect(component.onGroupToImportSelection).toHaveBeenCalledTimes(0);
//   //   const expectedSelection = createGroupResource().elements;
//   //
//   //   const selectorEl = fixture.debugElement.query(By.css('.group-selector'));
//   //   selectorEl.triggerEventHandler('selectionChange', expectedSelection);
//   //
//   //   expect(component.onGroupToImportSelection).toHaveBeenCalledTimes(1);
//   //   expect(component.onGroupToImportSelection).toHaveBeenCalledWith(expectedSelection);
//   // });
//   //
//   // it('should call method on group-overview selector fetch event', () => {
//   //   spyOn(component, 'searchGroups');
//   //   expect(component.searchGroups).toHaveBeenCalledTimes(0);
//   //   const expectedSearchValue = 'test value';
//   //
//   //   const selectorEl = fixture.debugElement.query(By.css('.group-selector'));
//   //   selectorEl.triggerEventHandler('fetch', expectedSearchValue);
//   //
//   //   expect(component.searchGroups).toHaveBeenCalledTimes(1);
//   //   expect(component.searchGroups).toHaveBeenCalledWith(expectedSearchValue);
//   // });
//   //
//   // it('should display kypo controls for users to assign', () => {
//   //   const controlsEl = fixture.debugElement.query(By.css('.to-assign-controls'));
//   //   expect(controlsEl).toBeTruthy();
//   // });
//   //
//   // it('should call method on kypo controls for users to assign event', () => {
//   //   spyOn(component, 'onControlAction');
//   //   expect(component.onControlAction).toHaveBeenCalledTimes(0);
//   //   const expectedEl = new SaveControlItem('', of(false), EMPTY);
//   //
//   //   const controlsEl = fixture.debugElement.query(By.css('.to-assign-controls'));
//   //   controlsEl.triggerEventHandler('itemClicked', expectedEl);
//   //
//   //   expect(component.onControlAction).toHaveBeenCalledTimes(1);
//   // });
//   //
//   // it('should display kypo controls for assigned users', () => {
//   //   const controlsEl = fixture.debugElement.query(By.css('.assigned-controls'));
//   //   expect(controlsEl).toBeTruthy();
//   // });
//   //
//   // it('should call method on kypo controls for assigned users event', () => {
//   //   spyOn(component, 'onControlAction');
//   //   expect(component.onControlAction).toHaveBeenCalledTimes(0);
//   //   const expectedEvent = new SaveControlItem('', of(false), EMPTY);
//   //
//   //   const controlsEl = fixture.debugElement.query(By.css('.assigned-controls'));
//   //   controlsEl.triggerEventHandler('itemClicked', expectedEvent);
//   //
//   //   expect(component.onControlAction).toHaveBeenCalledTimes(1);
//   // });
//   //
//   // it('should display kypo table of assigned users', () => {
//   //   const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
//   //   expect(tableEl).toBeTruthy();
//   // });
//   //
//   // it('should call method on kypo table selection event', () => {
//   //   spyOn(component, 'onAssignedUsersSelection');
//   //   expect(component.onAssignedUsersSelection).toHaveBeenCalledTimes(0);
//   //   const expectedSelection = createUserResource().elements;
//   //
//   //   const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
//   //   tableEl.triggerEventHandler('rowSelection', expectedSelection);
//   //
//   //   expect(component.onAssignedUsersSelection).toHaveBeenCalledTimes(1);
//   //   expect(component.onAssignedUsersSelection).toHaveBeenCalledWith(expectedSelection);
//   // });
//   //
//   // it('should call method on kypo table row action event', () => {
//   //   spyOn(component, 'onAssignedUsersTableAction');
//   //   expect(component.onAssignedUsersTableAction).toHaveBeenCalledTimes(0);
//   //   const userRow = createUserResource().elements[0];
//   //   const action = new UserDeleteAction(of(false), EMPTY);
//   //
//   //   const expectedEvent = new TableActionEvent<User>(userRow, action);
//   //
//   //   const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
//   //   tableEl.triggerEventHandler('rowAction', expectedEvent);
//   //
//   //   expect(component.onAssignedUsersTableAction).toHaveBeenCalledTimes(1);
//   //   expect(component.onAssignedUsersTableAction).toHaveBeenCalledWith(expectedEvent);
//   // });
//   //
//   // it('should call method on kypo table refresh event', () => {
//   //   spyOn(component, 'onAssignedLoadEvent');
//   //   expect(component.onAssignedLoadEvent).toHaveBeenCalledTimes(0);
//   //   const expectedEvent = new TableLoadEvent(createPagination(), 'someFilter');
//   //
//   //   const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
//   //   tableEl.triggerEventHandler('refresh', expectedEvent);
//   //
//   //   expect(component.onAssignedLoadEvent).toHaveBeenCalledTimes(1);
//   //   expect(component.onAssignedLoadEvent).toHaveBeenCalledWith(expectedEvent);
//   // });
//   //
//   function createUserResource(): PaginatedResource<User> {
//     const users = [new User(), new User(), new User()];
//     users.forEach((user, index) => (user.id = index));
//     const pagination = new OffsetPagination(0, 3, 10, 3, 1);
//     return new PaginatedResource<User>(users, pagination);
//   }

//   function createGroupResource(): PaginatedResource<Group> {
//     const groups = [new Group(), new Group(), new Group()];
//     groups.forEach((group, index) => (group.id = index));
//     const pagination = new OffsetPagination(0, 3, 10, 3, 1);
//     return new PaginatedResource<Group>(groups, pagination);
//   }
// });
