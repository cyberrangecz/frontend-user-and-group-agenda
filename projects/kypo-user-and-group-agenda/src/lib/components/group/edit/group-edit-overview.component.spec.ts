import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { KypoControlsComponent } from 'kypo-controls';
import { Group } from 'kypo-user-and-group-model';
import { BehaviorSubject, of } from 'rxjs';
import { SaveControlItem } from '../../../model/controls/save-control-item';
import { GroupChangedEvent } from '../../../model/events/group-changed-event';
import { GroupEditService } from '../../../services/group/edit/group-edit.service';
import { createKypoControlsOverride } from '../../../testing/testing-commons';
import { GroupEditMaterialModule } from './group-edit-material.module';
import { GroupEditOverviewComponent } from './group-edit-overview.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupRoleAssignComponent } from './group-role-assign/group-role-assign.component';
import { GroupUserAssignComponent } from './group-user-assign/group-user-assign.component';

describe('GroupEditOverviewComponent', () => {
  let component: GroupEditOverviewComponent;
  let fixture: ComponentFixture<GroupEditOverviewComponent>;
  let cd: ChangeDetectorRef;

  let editServiceSpy: jasmine.SpyObj<GroupEditService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  const editModeSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  beforeEach(async(() => {
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['x']);
    editServiceSpy = jasmine.createSpyObj('GroupEditService', ['set', 'save', 'createAndEdit', 'change']);
    activatedRouteSpy.data = of({ group: null });
    editServiceSpy.editMode$ = editModeSubject$.asObservable();
    TestBed.configureTestingModule({
      imports: [GroupEditMaterialModule, NoopAnimationsModule],
      declarations: [GroupEditOverviewComponent],
      providers: [
        { provide: GroupEditService, useValue: editServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    })
      .overrideComponent(KypoControlsComponent, createKypoControlsOverride())
      .overrideComponent(GroupEditComponent, {
        set: {
          selector: 'kypo-group-edit',
          inputs: ['group'],
          outputs: ['onGroupChanged'],
        },
      })
      .overrideComponent(GroupUserAssignComponent, {
        set: {
          selector: 'kypo-group-user-assign',
          inputs: ['resource'],
          outputs: ['hasUnsavedChanges'],
        },
      })
      .overrideComponent(GroupRoleAssignComponent, {
        set: {
          selector: 'kypo-group-user-assign',
          inputs: ['resource'],
          outputs: ['hasUnsavedChanges'],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEditOverviewComponent);
    component = fixture.componentInstance;
    cd = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init controls on edit mode true', () => {
    editModeSubject$.next(true);
    expect(component.controls).toBeTruthy();
    expect(component.controls.length).toBe(1);
  });

  it('should init controls on edit mode false', () => {
    editModeSubject$.next(false);
    expect(component.controls).toBeTruthy();
    expect(component.controls.length).toBe(2);
  });

  it('should init service', () => {
    expect(editServiceSpy.set).toHaveBeenCalledTimes(1);
  });

  it('should return true on can deactivate after no changes', () => {
    expect(component.canDeactivate()).toBeTruthy();
  });

  it('should return false on can deactivate after group changed', () => {
    expect(component.canDeactivate()).toBeTruthy();
    component.onGroupChanged(new GroupChangedEvent(new Group(), true));
    expect(component.canDeactivate()).toBeFalsy();
  });

  it('should return false on can deactivate after roles changed', () => {
    expect(component.canDeactivate()).toBeTruthy();
    component.onUnsavedRolesChange(true);
    expect(component.canDeactivate()).toBeFalsy();
  });

  it('should return false on can deactivate after members changed', () => {
    expect(component.canDeactivate()).toBeTruthy();
    component.onUnsavedMembersChange(true);
    expect(component.canDeactivate()).toBeFalsy();
  });

  it('should call service on group changed', () => {
    expect(editServiceSpy.change).toHaveBeenCalledTimes(0);
    const expectedEvent = new GroupChangedEvent(new Group(), true);

    component.onGroupChanged(expectedEvent);

    expect(editServiceSpy.change).toHaveBeenCalledTimes(1);
    expect(editServiceSpy.change).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call service on save control action in edit mode', () => {
    editServiceSpy.save.and.returnValue(of(true));
    expect(editServiceSpy.save).toHaveBeenCalledTimes(0);
    editModeSubject$.next(true);
    const expectedAction = component.controls.find((control) => control.id === SaveControlItem.ID);

    component.onControlAction(expectedAction);

    expect(editServiceSpy.save).toHaveBeenCalledTimes(1);
  });

  it('should call service on save control action not in edit mode', () => {
    editServiceSpy.save.and.returnValue(of(true));
    expect(editServiceSpy.save).toHaveBeenCalledTimes(0);
    editModeSubject$.next(false);
    const expectedAction = component.controls.find((control) => control.id === SaveControlItem.ID);

    component.onControlAction(expectedAction);

    expect(editServiceSpy.save).toHaveBeenCalledTimes(1);
  });

  it('should call service on save and stay control action not in edit mode', () => {
    editServiceSpy.createAndEdit.and.returnValue(of(true));
    expect(editServiceSpy.createAndEdit).toHaveBeenCalledTimes(0);
    editModeSubject$.next(false);
    const expectedAction = component.controls.find((control) => control.id === 'save_and_stay');

    component.onControlAction(expectedAction);

    expect(editServiceSpy.createAndEdit).toHaveBeenCalledTimes(1);
  });

  it('should set can deactivate to true after save control in edit mode', () => {
    editServiceSpy.save.and.returnValue(of(true));
    editModeSubject$.next(true);
    const expectedAction = component.controls.find((control) => control.id === SaveControlItem.ID);

    expect(component.canDeactivate()).toBeTruthy();
    component.onGroupChanged(new GroupChangedEvent(new Group(), true));
    expect(component.canDeactivate()).toBeFalsy();
    component.onControlAction(expectedAction);

    expect(component.canDeactivate()).toBeTruthy();
  });

  it('should set can deactivate to true after save control not in edit mode', () => {
    editServiceSpy.save.and.returnValue(of(true));
    editModeSubject$.next(false);
    const expectedAction = component.controls.find((control) => control.id === SaveControlItem.ID);

    expect(component.canDeactivate()).toBeTruthy();
    component.onGroupChanged(new GroupChangedEvent(new Group(), true));
    expect(component.canDeactivate()).toBeFalsy();
    component.onControlAction(expectedAction);

    expect(component.canDeactivate()).toBeTruthy();
  });

  it('should set can deactivate to true after save and stay control not in edit mode', () => {
    editServiceSpy.createAndEdit.and.returnValue(of(true));
    editModeSubject$.next(false);
    const expectedAction = component.controls.find((control) => control.id === 'save_and_stay');

    expect(component.canDeactivate()).toBeTruthy();
    component.onGroupChanged(new GroupChangedEvent(new Group(), true));
    expect(component.canDeactivate()).toBeFalsy();
    component.onControlAction(expectedAction);

    expect(component.canDeactivate()).toBeTruthy();
  });

  it('should display display correct title in edit mode', () => {
    editModeSubject$.next(true);
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('.group-edit-title'));

    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerHTML).toContain('Edit Group');
  });

  it('should display display correct title not in edit mode', () => {
    editModeSubject$.next(false);
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('.group-edit-title'));

    expect(titleEl).toBeTruthy();
    expect(titleEl.nativeElement.innerHTML).toContain('Create Group');
  });

  it('should display group edit component', () => {
    const groupEditComponentEl = fixture.debugElement.query(By.css('kypo-group-edit'));
    expect(groupEditComponentEl).toBeTruthy();
  });

  it('should display group user assign component', () => {
    const groupUserAssignComponentEl = fixture.debugElement.query(By.css('kypo-group-user-assign'));
    expect(groupUserAssignComponentEl).toBeTruthy();
  });

  it('should display group role assign component', () => {
    const groupRoleAssignComponentEl = fixture.debugElement.query(By.css('kypo-group-role-assign'));
    expect(groupRoleAssignComponentEl).toBeTruthy();
  });

  it('should collapse group roles panel in edit mode', () => {
    editModeSubject$.next(true);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-edit-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-expanded']).toEqual('false');
  });

  it('should expand group roles panel if not in edit mode', () => {
    editModeSubject$.next(false);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-edit-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-expanded']).toEqual('true');
  });

  it('should disable group members panel if not in edit mode', () => {
    editModeSubject$.next(false);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-members-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should not disable group members panel in edit mode', () => {
    editModeSubject$.next(true);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-members-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-disabled']).toEqual('false');
  });

  it('should collapse group members panel if not in edit mode', () => {
    editModeSubject$.next(false);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-members-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-expanded']).toEqual('false');
  });

  it('should expand group members panel in edit mode', () => {
    editModeSubject$.next(true);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-members-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-expanded']).toEqual('true');
  });

  it('should disable group roles panel if not in edit mode', () => {
    editModeSubject$.next(false);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-roles-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should not disable group roles panel in edit mode', () => {
    editModeSubject$.next(true);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-roles-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-disabled']).toEqual('false');
  });

  it('should collapse group roles panel if not in edit mode', () => {
    editModeSubject$.next(false);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-roles-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-expanded']).toEqual('false');
  });

  it('should expand group roles panel in edit mode', () => {
    editModeSubject$.next(true);
    fixture.detectChanges();

    const groupMembersPanelEl = fixture.debugElement.query(By.css('.group-roles-panel'));
    expect(groupMembersPanelEl).toBeTruthy();
    expect(groupMembersPanelEl.attributes['ng-reflect-expanded']).toEqual('true');
  });

  it('should display warning if group members has unsaved changes', fakeAsync(() => {
    editModeSubject$.next(true);
    fixture.detectChanges();
    let warningEl = fixture.debugElement.query(By.css('.group-members-unsaved'));
    expect(warningEl).toBeFalsy();

    component.onUnsavedMembersChange(true);
    detectChanges();
    warningEl = fixture.debugElement.query(By.css('.group-members-unsaved'));

    expect(warningEl).toBeTruthy();
  }));

  it('should display warning if group roles has unsaved changes', fakeAsync(() => {
    editModeSubject$.next(true);
    fixture.detectChanges();
    let warningEl = fixture.debugElement.query(By.css('.group-roles-unsaved'));
    expect(warningEl).toBeFalsy();

    component.onUnsavedRolesChange(true);
    detectChanges();
    warningEl = fixture.debugElement.query(By.css('.group-roles-unsaved'));

    expect(warningEl).toBeTruthy();
  }));

  function detectChanges() {
    cd.markForCheck();
    fixture.autoDetectChanges();
    flush();
  }
});
