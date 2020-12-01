import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginatedResource, SentinelPagination, RequestedPagination } from '@sentinel/common';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { User } from '@kypo/user-and-group-model';
import { SentinelTableComponent, LoadTableEvent, RowAction, TableActionEvent } from '@sentinel/components/table';
import { EMPTY, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { DeleteControlItem } from '@kypo/user-and-group-agenda/internal';
import { UserAndGroupContext } from '@kypo/user-and-group-agenda/internal';
import { UserOverviewService } from '@kypo/user-and-group-agenda/user-overview';
import {
  createContextSpy,
  createSentinelControlsOverride,
  createSentinelOverride,
  createPagination,
  SENTINEL_CONTROLS_COMPONENT_SELECTOR,
  SENTINEL_TABLE_COMPONENT_SELECTOR,
} from '../../../internal/src/testing/testing-commons';
import { UserMaterialModule } from './user-material.module';
import { UserOverviewComponent } from './user-overview.component';

describe('UserOverviewComponent', () => {
  let component: UserOverviewComponent;
  let fixture: ComponentFixture<UserOverviewComponent>;
  let cd: ChangeDetectorRef;

  let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
  let overviewSpy: jasmine.SpyObj<UserOverviewService>;

  beforeEach(async(() => {
    contextSpy = createContextSpy();
    overviewSpy = jasmine.createSpyObj('UserOverviewComponent', ['getAll', 'delete', 'deleteSelected', 'setSelection']);
    overviewSpy.getAll.and.returnValue(of(createDefaultResource()));
    overviewSpy.resource$ = of(createDefaultResource());
    overviewSpy.hasError$ = of(false);
    overviewSpy.isLoading$ = of(false);
    overviewSpy.selected$ = of([]);
    TestBed.configureTestingModule({
      imports: [UserMaterialModule],
      declarations: [UserOverviewComponent],
      providers: [
        { provide: UserAndGroupContext, useValue: contextSpy },
        { provide: UserOverviewService, useValue: overviewSpy },
      ],
    })
      .overrideComponent(SentinelTableComponent, createSentinelOverride())
      .overrideComponent(SentinelControlsComponent, createSentinelControlsOverride())
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOverviewComponent);
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

  it('should call service on delete action of table', (done) => {
    expect(overviewSpy.delete).toHaveBeenCalledTimes(0);
    component.users$.pipe(take(1)).subscribe(
      (table) => {
        const firstRow = table.rows[0];
        expect(firstRow).toBeTruthy();
        const expectedUser = firstRow.element;
        const deleteTableAction = firstRow.actions.find((action) => action.id === 'delete');
        expect(deleteTableAction).toBeTruthy();
        component.onTableAction(new TableActionEvent(expectedUser, deleteTableAction));
        expect(overviewSpy.delete).toHaveBeenCalledTimes(1);
        expect(overviewSpy.delete).toHaveBeenCalledWith(expectedUser);
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

    component.onLoadEvent(loadEvent);
    expect(overviewSpy.getAll).toHaveBeenCalledTimes(2);
    expect(overviewSpy.getAll).toHaveBeenCalledWith(loadEvent.pagination, loadEvent.filter);
  });

  it('should call service on user selected', () => {
    expect(overviewSpy.setSelection).toHaveBeenCalledTimes(0);
    const expectedUsers = createDefaultResource().elements;

    component.onUserSelected(expectedUsers);
    expect(overviewSpy.setSelection).toHaveBeenCalledTimes(1);
    expect(overviewSpy.setSelection).toHaveBeenCalledWith(expectedUsers);
  });

  function createDefaultResource(): PaginatedResource<User> {
    const users = [new User(), new User(), new User()];
    users.forEach((user, index) => (user.id = index));
    const pagination = new SentinelPagination(0, users.length, 5, users.length, 1);
    return new PaginatedResource<User>(users, pagination);
  }

  it('should call bound method on kypo table refresh output', () => {
    spyOn(component, 'onLoadEvent');
    expect(component.onLoadEvent).toHaveBeenCalledTimes(0);

    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    const expectedEvent = new LoadTableEvent(createPagination(), 'someFilter');

    kypoTableEl.triggerEventHandler('refresh', expectedEvent);
    expect(component.onLoadEvent).toHaveBeenCalledTimes(1);
    expect(component.onLoadEvent).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call bound method on kypo table row action', () => {
    spyOn(component, 'onTableAction');
    expect(component.onTableAction).toHaveBeenCalledTimes(0);

    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    const user = new User();
    user.id = 1;
    const expectedEvent = new TableActionEvent<User>(
      user,
      new RowAction('test', 'test', 'test', 'primary', 'test', of(false), EMPTY)
    );

    kypoTableEl.triggerEventHandler('rowAction', expectedEvent);
    expect(component.onTableAction).toHaveBeenCalledTimes(1);
    expect(component.onTableAction).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call bound method on kypo table row selection', () => {
    spyOn(component, 'onUserSelected');
    expect(component.onUserSelected).toHaveBeenCalledTimes(0);

    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    const expectedEvent = createDefaultResource().elements;

    kypoTableEl.triggerEventHandler('rowSelection', expectedEvent);
    expect(component.onUserSelected).toHaveBeenCalledTimes(1);
    expect(component.onUserSelected).toHaveBeenCalledWith(expectedEvent);
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
});
