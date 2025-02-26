import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OffsetPagination, OffsetPaginationEvent, PaginatedResource } from '@sentinel/common/pagination';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { Group } from '@crczp/user-and-group-model';
import { RowAction, SentinelTableComponent, TableActionEvent, TableLoadEvent } from '@sentinel/components/table';
import { EMPTY, of } from 'rxjs';
import { take } from 'rxjs/operators';
import {
    DeleteControlItem,
    PaginationService,
    SaveControlItem,
    UserAndGroupContext,
} from '@crczp/user-and-group-agenda/internal';
import { GroupOverviewService } from '../services/group-overview.service';
import {
    createContextSpy,
    createNavigatorSpy,
    createPagination,
    createPaginationServiceSpy,
    createSentinelControlsOverride,
    createSentinelOverride,
    SENTINEL_CONTROLS_COMPONENT_SELECTOR,
    SENTINEL_TABLE_COMPONENT_SELECTOR,
} from '../../../internal/src/testing/testing-commons.spec';
import { GroupOverviewMaterialModule } from './group-overview-material.module';
import { GroupOverviewComponent } from './group-overview.component';
import { UserAndGroupNavigator } from '@crczp/user-and-group-agenda';

describe('GroupOverviewComponent', () => {
    let component: GroupOverviewComponent;
    let fixture: ComponentFixture<GroupOverviewComponent>;
    let paginationServiceSpy: jasmine.SpyObj<PaginationService>;
    let navigatorSpy: jasmine.SpyObj<UserAndGroupNavigator>;
    let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
    let overviewSpy: jasmine.SpyObj<GroupOverviewService>;

    beforeEach(waitForAsync(() => {
        contextSpy = createContextSpy();
        paginationServiceSpy = createPaginationServiceSpy();
        navigatorSpy = createNavigatorSpy();
        overviewSpy = jasmine.createSpyObj('GroupOverviewComponent', [
            'getAll',
            'delete',
            'deleteSelected',
            'edit',
            'create',
            'setSelection',
        ]);
        overviewSpy.getAll.and.returnValue(of(createDefaultResource()));
        overviewSpy.create.and.returnValue(EMPTY);
        overviewSpy.delete.and.returnValue(EMPTY);
        overviewSpy.edit.and.returnValue(EMPTY);
        overviewSpy.deleteSelected.and.returnValue(EMPTY);
        overviewSpy.resource$ = of(createDefaultResource());
        overviewSpy.hasError$ = of(false);
        overviewSpy.isLoading$ = of(false);
        overviewSpy.selected$ = of([]);
        navigatorSpy.toGroupDetail.and.returnValue('group-detail');
        navigatorSpy.toUserOverview.and.returnValue('group-overview');
        TestBed.configureTestingModule({
            imports: [GroupOverviewMaterialModule],
            declarations: [GroupOverviewComponent],
            providers: [
                { provide: UserAndGroupContext, useValue: contextSpy },
                { provide: UserAndGroupNavigator, useValue: navigatorSpy },
                { provide: GroupOverviewService, useValue: overviewSpy },
                { provide: PaginationService, useValue: paginationServiceSpy },
            ],
        })
            .overrideComponent(SentinelTableComponent, createSentinelOverride())
            .overrideComponent(SentinelControlsComponent, createSentinelControlsOverride())
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should request data on init', fakeAsync(() => {
        const expectedOffsetPaginationEvent = new OffsetPaginationEvent(
            0,
            paginationServiceSpy.DEFAULT_PAGINATION,
            component.INIT_SORT_NAME,
            component.INIT_SORT_DIR,
        );
        expect(overviewSpy.getAll).toHaveBeenCalledTimes(1);
        expect(overviewSpy.getAll).toHaveBeenCalledWith(expectedOffsetPaginationEvent, undefined);
    }));

    it('should init controls on init', () => {
        expect(component.controls).toBeTruthy();
    });

    it('should diplay table component', () => {
        const tableElement = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
        expect(tableElement).toBeTruthy();
    });

    it('should diplay controls component', () => {
        const tableElement = fixture.debugElement.query(By.css(SENTINEL_CONTROLS_COMPONENT_SELECTOR));
        expect(tableElement).toBeTruthy();
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
            () => fail(),
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
            () => fail(),
        );
    });

    it('should call service on load event', () => {
        expect(overviewSpy.getAll).toHaveBeenCalledTimes(1);
        const expectedPagination = createPagination();
        const expectedFilter = 'someFilter';
        const loadEvent: TableLoadEvent = { pagination: expectedPagination, filter: expectedFilter };

        component.onTableLoadEvent(loadEvent);
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

    it('should call bound method on table refresh output', fakeAsync(() => {
        spyOn(component, 'onTableLoadEvent');
        expect(component.onTableLoadEvent).toHaveBeenCalledTimes(0);

        const tableElement = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
        const expectedEvent: TableLoadEvent = { pagination: createPagination(), filter: 'someFilter' };

        tableElement.triggerEventHandler('tableLoad', expectedEvent);
        expect(component.onTableLoadEvent).toHaveBeenCalledTimes(1);
        expect(component.onTableLoadEvent).toHaveBeenCalledWith(expectedEvent);
    }));

    it('should call bound method on table row action', fakeAsync(() => {
        spyOn(component, 'onTableAction');
        expect(component.onTableAction).toHaveBeenCalledTimes(0);
        navigatorSpy.toGroupDetail.and.returnValue('test-url');

        const tableElement = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
        const group = new Group();
        group.id = 1;
        const expectedEvent = new TableActionEvent<Group>(
            group,
            new RowAction('test', 'test', 'test', 'primary', 'test', of(false), EMPTY),
        );

        tableElement.triggerEventHandler('rowAction', expectedEvent);
        expect(component.onTableAction).toHaveBeenCalledTimes(1);
        expect(component.onTableAction).toHaveBeenCalledWith(expectedEvent);
    }));

    it('should call bound method on table row selection', fakeAsync(() => {
        spyOn(component, 'onGroupSelected');
        expect(component.onGroupSelected).toHaveBeenCalledTimes(0);

        const tableElement = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
        const expectedEvent = createDefaultResource().elements;

        tableElement.triggerEventHandler('rowSelection', expectedEvent);
        expect(component.onGroupSelected).toHaveBeenCalledTimes(1);
        expect(component.onGroupSelected).toHaveBeenCalledWith(expectedEvent);
    }));

    it('should call bound method on controls action', fakeAsync(() => {
        spyOn(component, 'onControlsAction');
        expect(component.onControlsAction).toHaveBeenCalledTimes(0);

        const controlsElement = fixture.debugElement.query(By.css(SENTINEL_CONTROLS_COMPONENT_SELECTOR));
        const expectedEvent = new DeleteControlItem(0, EMPTY);

        controlsElement.triggerEventHandler('itemClicked', expectedEvent);
        expect(component.onControlsAction).toHaveBeenCalledTimes(1);
        expect(component.onControlsAction).toHaveBeenCalledWith(expectedEvent);
    }));

    function createDefaultResource(): PaginatedResource<Group> {
        const groups = [new Group(), new Group(), new Group()];
        groups.forEach((group, index) => {
            group.id = index;
            group.name = 'name';
            group.description = 'description';
            group.expirationDate = new Date();
            group.roles = [];
            group.members = [];
        });
        const pagination = new OffsetPagination(0, groups.length, 5, groups.length, 1);
        return new PaginatedResource<Group>(groups, pagination);
    }
});
