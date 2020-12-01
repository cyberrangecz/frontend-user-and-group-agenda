import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginatedResource, SentinelPagination, RequestedPagination } from '@sentinel/common';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { Group } from '@kypo/user-and-group-model';
import { SentinelTableComponent, LoadTableEvent, RowAction, TableActionEvent } from '@sentinel/components/table';
import { EMPTY, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { DeleteControlItem } from '@kypo/user-and-group-agenda/internal';
import { SaveControlItem } from '@kypo/user-and-group-agenda/internal';
import { GroupOverviewService } from '../services/group-overview.service';
import { UserAndGroupContext } from '@kypo/user-and-group-agenda/internal';
import {
  createContextSpy,
  createSentinelControlsOverride,
  createSentinelOverride,
  createPagination,
  SENTINEL_CONTROLS_COMPONENT_SELECTOR,
  SENTINEL_TABLE_COMPONENT_SELECTOR,
} from '../../../internal/src/testing/testing-commons';
import { GroupOverviewMaterialModule } from './group-overview-material.module';
import { GroupOverviewComponent } from './group-overview.component';

describe('GroupOverviewComponent', () => {
  let component: GroupOverviewComponent;
  let fixture: ComponentFixture<GroupOverviewComponent>;
  let cd: ChangeDetectorRef;

  let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
  let overviewSpy: jasmine.SpyObj<GroupOverviewService>;

  beforeEach(async(() => {
    contextSpy = createContextSpy();
    overviewSpy = jasmine.createSpyObj('UserOverviewComponent', [
      'getAll',
      'delete',
      'deleteSelected',
      'edit',
      'create',
      'setSelection',
    ]);
    overviewSpy.getAll.and.returnValue(of(createDefaultResource()));
    overviewSpy.resource$ = of(createDefaultResource());
    overviewSpy.hasError$ = of(false);
    overviewSpy.isLoading$ = of(false);
    overviewSpy.selected$ = of([]);
    TestBed.configureTestingModule({
      imports: [GroupOverviewMaterialModule],
      declarations: [GroupOverviewComponent],
      providers: [
        { provide: UserAndGroupContext, useValue: contextSpy },
        { provide: GroupOverviewService, useValue: overviewSpy },
      ],
    })
      .overrideComponent(SentinelTableComponent, createSentinelOverride())
      .overrideComponent(SentinelControlsComponent, createSentinelControlsOverride())
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupOverviewComponent);
    component = fixture.componentInstance;
    cd = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request data on init', () => {
    const expectedRequestedPagination = new RequestedPagination(
      0,
      contextSpy.config.defaultPaginationSize,
      component.INIT_SORT_NAME,
      component.INIT_SORT_DIR
    );
    expect(overviewSpy.getAll).toHaveBeenCalledTimes(1);
    expect(overviewSpy.getAll).toHaveBeenCalledWith(expectedRequestedPagination, null);
  });

  it('should init controls on init', () => {
    expect(component.controls).toBeTruthy();
  });

  it('should diplay kypo table component', () => {
    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    expect(kypoTableEl).toBeTruthy();
  });

  it('should diplay kypo controls component', () => {
    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_CONTROLS_COMPONENT_SELECTOR));
    expect(kypoTableEl).toBeTruthy();
  });

  it('should call service on delete action of controls', () => {
    expect(overviewSpy.deleteSelected).toHaveBeenCalledTimes(0);
    const deleteControlItem = component.controls.find((control) => control.id === DeleteControlItem.ID);
    expect(deleteControlItem).toBeTruthy();
    component.onControlsAction(deleteControlItem);
    expect(overviewSpy.deleteSelected).toHaveBeenCalledTimes(1);
  });

  it('should call service on save action of controls', () => {
    expect(overviewSpy.create).toHaveBeenCalledTimes(0);
    const saveControlItem = component.controls.find((control) => control.id === SaveControlItem.ID);
    expect(saveControlItem).toBeTruthy();
    component.onControlsAction(saveControlItem);
    expect(overviewSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call service on delete action of table', (done) => {
    expect(overviewSpy.delete).toHaveBeenCalledTimes(0);
    component.groups$.pipe(take(1)).subscribe(
      (table) => {
        const firstRow = table.rows[0];
        expect(firstRow).toBeTruthy();
        const expectedGroup = firstRow.element;
        const deleteTableAction = firstRow.actions.find((action) => action.id === 'delete');
        expect(deleteTableAction).toBeTruthy();
        component.onTableAction(new TableActionEvent(firstRow.element, deleteTableAction));
        expect(overviewSpy.delete).toHaveBeenCalledTimes(1);
        expect(overviewSpy.delete).toHaveBeenCalledWith(expectedGroup);
        done();
      },
      () => fail()
    );
  });

  it('should call service on state action of table', (done) => {
    expect(overviewSpy.edit).toHaveBeenCalledTimes(0);
    component.groups$.pipe(take(1)).subscribe(
      (table) => {
        const firstRow = table.rows[0];
        expect(firstRow).toBeTruthy();
        const expectedGroup = firstRow.element;
        const editTableAction = firstRow.actions.find((action) => action.id === 'edit');
        expect(editTableAction).toBeTruthy();
        component.onTableAction(new TableActionEvent(firstRow.element, editTableAction));
        expect(overviewSpy.edit).toHaveBeenCalledTimes(1);
        expect(overviewSpy.edit).toHaveBeenCalledWith(expectedGroup);
        done();
      },
      () => fail()
    );
  });

  it('should call service on load event', () => {
    expect(overviewSpy.getAll).toHaveBeenCalledTimes(1);
    const expectedPagination = createPagination();
    const expectedFilter = 'someFilter';
    const loadEvent = new LoadTableEvent(expectedPagination, expectedFilter);

    component.onLoadTableEvent(loadEvent);
    expect(overviewSpy.getAll).toHaveBeenCalledTimes(2);
    expect(overviewSpy.getAll).toHaveBeenCalledWith(loadEvent.pagination, loadEvent.filter);
  });

  it('should call service on group-overview selected', () => {
    expect(overviewSpy.setSelection).toHaveBeenCalledTimes(0);
    const expectedGroups = createDefaultResource().elements;

    component.onGroupSelected(expectedGroups);
    expect(overviewSpy.setSelection).toHaveBeenCalledTimes(1);
    expect(overviewSpy.setSelection).toHaveBeenCalledWith(expectedGroups);
  });

  it('should call bound method on kypo table refresh output', () => {
    spyOn(component, 'onLoadTableEvent');
    expect(component.onLoadTableEvent).toHaveBeenCalledTimes(0);

    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    const expectedEvent = new LoadTableEvent(createPagination(), 'someFilter');

    kypoTableEl.triggerEventHandler('refresh', expectedEvent);
    expect(component.onLoadTableEvent).toHaveBeenCalledTimes(1);
    expect(component.onLoadTableEvent).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call bound method on kypo table row action', () => {
    spyOn(component, 'onTableAction');
    expect(component.onTableAction).toHaveBeenCalledTimes(0);

    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    const group = new Group();
    group.id = 1;
    const expectedEvent = new TableActionEvent<Group>(
      group,
      new RowAction('test', 'test', 'test', 'primary', 'test', of(false), EMPTY)
    );

    kypoTableEl.triggerEventHandler('rowAction', expectedEvent);
    expect(component.onTableAction).toHaveBeenCalledTimes(1);
    expect(component.onTableAction).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call bound method on kypo table row selection', () => {
    spyOn(component, 'onGroupSelected');
    expect(component.onGroupSelected).toHaveBeenCalledTimes(0);

    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    const expectedEvent = createDefaultResource().elements;

    kypoTableEl.triggerEventHandler('rowSelection', expectedEvent);
    expect(component.onGroupSelected).toHaveBeenCalledTimes(1);
    expect(component.onGroupSelected).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call bound method on kypo controls action', () => {
    spyOn(component, 'onControlsAction');
    expect(component.onControlsAction).toHaveBeenCalledTimes(0);

    const kypoControlsEl = fixture.debugElement.query(By.css(SENTINEL_CONTROLS_COMPONENT_SELECTOR));
    const expectedEvent = new DeleteControlItem(0, EMPTY);

    kypoControlsEl.triggerEventHandler('itemClicked', expectedEvent);
    expect(component.onControlsAction).toHaveBeenCalledTimes(1);
    expect(component.onControlsAction).toHaveBeenCalledWith(expectedEvent);
  });

  function createDefaultResource(): PaginatedResource<Group> {
    const groups = [new Group(), new Group(), new Group()];
    groups.forEach((group, index) => {
      group.id = index;
      group.expirationDate = new Date();
      group.roles = [];
      group.members = [];
    });
    const pagination = new SentinelPagination(0, groups.length, 5, groups.length, 1);
    return new PaginatedResource<Group>(groups, pagination);
  }
});
