import { ChangeDetectorRef, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginatedResource, SentinelPagination } from '@sentinel/common';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { Group, UserRole } from 'kypo-user-and-group-model';
import { SentinelTableComponent, LoadTableEvent, TableActionEvent } from '@sentinel/components/table';
import { SentinelResourceSelectorComponent } from '@sentinel/components/resource-selector';
import { EMPTY, of } from 'rxjs';
import { RoleDeleteAction } from '../../model/table/role-delete-action';
import { DeleteControlItem } from '@kypo/user-and-group-agenda/internal';
import { SaveControlItem } from '@kypo/user-and-group-agenda/internal';
import { RoleAssignService } from '@kypo/user-and-group-agenda/group-edit';
import { UserAndGroupContext } from '@kypo/user-and-group-agenda/internal';
import {
  createContextSpy,
  createSentinelControlsOverride,
  createSentinelOverride,
  createPagination,
  createResourceSelectorOverride,
  SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR,
  SENTINEL_TABLE_COMPONENT_SELECTOR,
} from '../../../../internal/src/testing/testing-commons';
import { GroupEditMaterialModule } from '../group-edit-material.module';
import { GroupRoleAssignComponent } from './group-role-assign.component';

describe('GroupRoleAssignComponent', () => {
  let component: GroupRoleAssignComponent;
  let fixture: ComponentFixture<GroupRoleAssignComponent>;
  let cd: ChangeDetectorRef;

  let roleAssignServiceSpy: jasmine.SpyObj<RoleAssignService>;
  let contextSpy: jasmine.SpyObj<UserAndGroupContext>;

  beforeEach(async(() => {
    const testUserRoles = createUserRoleResource();
    contextSpy = createContextSpy();
    roleAssignServiceSpy = jasmine.createSpyObj([
      'getAvailableToAssign',
      'getAssigned',
      'assign',
      'assignSelected',
      'unassign',
      'unassignSelected',
      'setSelectedRolesToAssign',
      'clearSelectedRolesToAssign',
      'setSelectedAssignedRoles',
      'clearSelectedAssignedRoles',
    ]);
    roleAssignServiceSpy.getAssigned.and.returnValue(of(testUserRoles));
    roleAssignServiceSpy.assignedRoles$ = of(testUserRoles);
    roleAssignServiceSpy.selectedAssignedRoles$ = of(testUserRoles.elements);
    roleAssignServiceSpy.selectedRolesToAssign$ = of(testUserRoles.elements);

    TestBed.configureTestingModule({
      imports: [GroupEditMaterialModule],
      declarations: [GroupRoleAssignComponent],
      providers: [
        { provide: UserAndGroupContext, useValue: contextSpy },
        { provide: RoleAssignService, useValue: roleAssignServiceSpy },
      ],
    })
      .overrideComponent(SentinelControlsComponent, createSentinelControlsOverride())
      .overrideComponent(SentinelTableComponent, createSentinelOverride())
      .overrideComponent(SentinelResourceSelectorComponent, createResourceSelectorOverride())
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRoleAssignComponent);
    component = fixture.componentInstance;
    const group = new Group();
    group.id = 1;
    component.resource = group;
    component.ngOnChanges({ resource: new SimpleChange(undefined, group, true) });
    cd = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.rolesToAssignControls).toBeTruthy();
    expect(component.rolesToAssignControls.length).toBeGreaterThan(0);
    expect(component.assignedRolesControls).toBeTruthy();
    expect(component.assignedRolesControls.length).toBeGreaterThan(0);
    expect(component.assignedRoles$).toBeTruthy();
    expect(roleAssignServiceSpy.getAssigned).toHaveBeenCalledTimes(1);
  });

  it('should call service on search', () => {
    roleAssignServiceSpy.getAvailableToAssign.and.returnValue(of(createUserRoleResource()));
    expect(roleAssignServiceSpy.getAvailableToAssign).toHaveBeenCalledTimes(0);
    const filterValue = 'test filter';

    component.search(filterValue);

    expect(roleAssignServiceSpy.getAvailableToAssign).toHaveBeenCalledTimes(1);
    expect(roleAssignServiceSpy.getAvailableToAssign).toHaveBeenCalledWith(filterValue);
  });

  it('should call service on roles to assign selection', () => {
    expect(roleAssignServiceSpy.setSelectedRolesToAssign).toHaveBeenCalledTimes(0);
    const expectedRoles = [new UserRole()];

    component.onRolesToAssignSelection(expectedRoles);

    expect(roleAssignServiceSpy.setSelectedRolesToAssign).toHaveBeenCalledTimes(1);
    expect(roleAssignServiceSpy.setSelectedRolesToAssign).toHaveBeenCalledWith(expectedRoles);
  });

  it('should call service on assigned roles selection', () => {
    expect(roleAssignServiceSpy.setSelectedAssignedRoles).toHaveBeenCalledTimes(0);
    const expectedRoles = [new UserRole()];

    component.onAssignedRolesSelection(expectedRoles);

    expect(roleAssignServiceSpy.setSelectedAssignedRoles).toHaveBeenCalledTimes(1);
    expect(roleAssignServiceSpy.setSelectedAssignedRoles).toHaveBeenCalledWith(expectedRoles);
  });

  it('should call service on assigned roles load', () => {
    roleAssignServiceSpy.getAssigned.and.returnValue(of(createUserRoleResource()));
    expect(roleAssignServiceSpy.getAssigned).toHaveBeenCalledTimes(1);
    const expectedLoadEvent = new LoadTableEvent(createPagination(), 'some filter');

    component.onAssignedRolesLoad(expectedLoadEvent);

    expect(roleAssignServiceSpy.getAssigned).toHaveBeenCalledTimes(2);
    expect(roleAssignServiceSpy.getAssigned).toHaveBeenCalledWith(
      jasmine.anything(),
      expectedLoadEvent.pagination,
      expectedLoadEvent.filter
    );
  });

  it('should call service on save control of roles to assign controls', () => {
    roleAssignServiceSpy.assignSelected.and.returnValue(of(true));
    expect(roleAssignServiceSpy.assignSelected).toHaveBeenCalledTimes(0);
    const controlItem = component.rolesToAssignControls.find((control) => control.id === SaveControlItem.ID);
    component.onControlAction(controlItem);

    expect(roleAssignServiceSpy.assignSelected).toHaveBeenCalledTimes(1);
  });

  it('should call service on delete control of assigned roles controls', () => {
    roleAssignServiceSpy.unassignSelected.and.returnValue(of(true));
    expect(roleAssignServiceSpy.unassignSelected).toHaveBeenCalledTimes(0);
    const controlItem = component.assignedRolesControls.find((control) => control.id === DeleteControlItem.ID);
    component.onControlAction(controlItem);

    expect(roleAssignServiceSpy.unassignSelected).toHaveBeenCalledTimes(1);
  });

  it('should display resource selector component', () => {
    const selectorEl = fixture.debugElement.query(By.css(SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR));
    expect(selectorEl).toBeTruthy();
  });

  it('should call method on resource selector selection event', () => {
    spyOn(component, 'onRolesToAssignSelection');
    expect(component.onRolesToAssignSelection).toHaveBeenCalledTimes(0);
    const expectedSelection = createUserRoleResource().elements;

    const selectorEl = fixture.debugElement.query(By.css(SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR));
    selectorEl.triggerEventHandler('selectionChange', expectedSelection);

    expect(component.onRolesToAssignSelection).toHaveBeenCalledTimes(1);
    expect(component.onRolesToAssignSelection).toHaveBeenCalledWith(expectedSelection);
  });

  it('should call method on resource selector fetch event', () => {
    spyOn(component, 'search');
    expect(component.search).toHaveBeenCalledTimes(0);
    const expectedSearchValue = 'test value';

    const selectorEl = fixture.debugElement.query(By.css(SENTINEL_RESOURCE_SELECTOR_COMPONENT_SELECTOR));
    selectorEl.triggerEventHandler('fetch', expectedSearchValue);

    expect(component.search).toHaveBeenCalledTimes(1);
    expect(component.search).toHaveBeenCalledWith(expectedSearchValue);
  });

  it('should display kypo controls for roles to assign', () => {
    const controlsEl = fixture.debugElement.query(By.css('.to-assign-controls'));
    expect(controlsEl).toBeTruthy();
  });

  it('should call method on kypo controls for roles to assign event', () => {
    spyOn(component, 'onControlAction');
    expect(component.onControlAction).toHaveBeenCalledTimes(0);
    const controlsEl = fixture.debugElement.query(By.css('.to-assign-controls'));
    const expectedEl = new SaveControlItem('', of(false), EMPTY);
    controlsEl.triggerEventHandler('itemClicked', expectedEl);

    expect(component.onControlAction).toHaveBeenCalledTimes(1);
  });

  it('should display kypo controls for assigned roles', () => {
    const controlsEl = fixture.debugElement.query(By.css('.assigned-controls'));
    expect(controlsEl).toBeTruthy();
  });

  it('should call method on kypo controls for assigned roles event', () => {
    spyOn(component, 'onControlAction');
    expect(component.onControlAction).toHaveBeenCalledTimes(0);
    const controlsEl = fixture.debugElement.query(By.css('.assigned-controls'));
    const expectedEvent = new SaveControlItem('', of(false), EMPTY);
    controlsEl.triggerEventHandler('itemClicked', expectedEvent);

    expect(component.onControlAction).toHaveBeenCalledTimes(1);
  });

  it('should display kypo table of assigned roles', () => {
    const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    expect(tableEl).toBeTruthy();
  });

  it('should call method on kypo table selection event', () => {
    spyOn(component, 'onAssignedRolesSelection');
    expect(component.onAssignedRolesSelection).toHaveBeenCalledTimes(0);
    const expectedSelection = createUserRoleResource().elements;

    const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    tableEl.triggerEventHandler('rowSelection', expectedSelection);

    expect(component.onAssignedRolesSelection).toHaveBeenCalledTimes(1);
    expect(component.onAssignedRolesSelection).toHaveBeenCalledWith(expectedSelection);
  });

  it('should call method on kypo table row action event', () => {
    spyOn(component, 'onAssignedRolesTableAction');
    expect(component.onAssignedRolesTableAction).toHaveBeenCalledTimes(0);
    const roleRow = createUserRoleResource().elements[0];
    const action = new RoleDeleteAction(of(false), EMPTY);
    const expectedEvent = new TableActionEvent<UserRole>(roleRow, action);

    const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    tableEl.triggerEventHandler('rowAction', expectedEvent);

    expect(component.onAssignedRolesTableAction).toHaveBeenCalledTimes(1);
    expect(component.onAssignedRolesTableAction).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call method on kypo table refresh event', () => {
    spyOn(component, 'onAssignedRolesLoad');
    expect(component.onAssignedRolesLoad).toHaveBeenCalledTimes(0);
    const expectedEvent = new LoadTableEvent(createPagination(), 'someFilter');

    const tableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    tableEl.triggerEventHandler('refresh', expectedEvent);

    expect(component.onAssignedRolesLoad).toHaveBeenCalledTimes(1);
    expect(component.onAssignedRolesLoad).toHaveBeenCalledWith(expectedEvent);
  });

  function createUserRoleResource(): PaginatedResource<UserRole> {
    const roles = [new UserRole(), new UserRole(), new UserRole()];
    const pagination = new SentinelPagination(0, 3, 10, 3, 1);
    return new PaginatedResource<UserRole>(roles, pagination);
  }
});
