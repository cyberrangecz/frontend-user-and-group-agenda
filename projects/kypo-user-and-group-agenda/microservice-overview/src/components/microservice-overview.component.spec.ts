import {
  SENTINEL_TABLE_COMPONENT_SELECTOR,
  SENTINEL_CONTROLS_COMPONENT_SELECTOR,
  createPagination,
  createPaginationServiceSpy,
} from '../../../internal/src/testing/testing-commons.spec';
import { of, EMPTY } from 'rxjs';
import { PaginatedResource, OffsetPagination, OffsetPaginationEvent } from '@sentinel/common';
import { SentinelControlsComponent } from '@sentinel/components/controls';
import { SentinelTableComponent, TableLoadEvent } from '@sentinel/components/table';
import { UserAndGroupContext } from './../../../internal/src/services/user-and-group-context.service';
import { MicroserviceOverviewMaterialModule } from './microservice-overview-material.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MicroserviceOverviewComponent } from './microservice-overview.component';
import { MicroserviceOverviewService } from '../services/microservice-overview.service';
import {
  createSentinelOverride,
  createSentinelControlsOverride,
  createContextSpy,
} from '../../../internal/src/testing/testing-commons.spec';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';
import { RegisterControlItem } from '../../../internal/src/model/controls/register-control-item';
import { PaginationService } from '../../../internal/src/services/pagination.service';

describe('MicroserviceOverviewComponent', () => {
  let component: MicroserviceOverviewComponent;
  let fixture: ComponentFixture<MicroserviceOverviewComponent>;

  let paginationServiceSpy: jasmine.SpyObj<PaginationService>;
  let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
  let overviewSpy: jasmine.SpyObj<MicroserviceOverviewService>;

  beforeEach(async(() => {
    contextSpy = createContextSpy();
    paginationServiceSpy = createPaginationServiceSpy();
    overviewSpy = jasmine.createSpyObj('MicroserviceOverviewService', ['getAll', 'register']);
    overviewSpy.getAll.and.returnValue(of(createDefaultResource()));
    overviewSpy.register.and.returnValue(EMPTY);
    overviewSpy.resource$ = of(createDefaultResource());
    overviewSpy.hasError$ = of(false);
    overviewSpy.isLoading$ = of(false);
    overviewSpy.selected$ = of([]);
    TestBed.configureTestingModule({
      imports: [MicroserviceOverviewMaterialModule],
      declarations: [MicroserviceOverviewComponent],
      providers: [
        { provide: UserAndGroupContext, useValue: contextSpy },
        { provide: PaginationService, useValue: paginationServiceSpy },
        { provide: MicroserviceOverviewService, useValue: overviewSpy },
      ],
    })
      .overrideComponent(SentinelTableComponent, createSentinelOverride())
      .overrideComponent(SentinelControlsComponent, createSentinelControlsOverride())
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroserviceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request data on init', () => {
    const expectedOffsetPaginationEvent = new OffsetPaginationEvent(
      0,
      contextSpy.config.defaultPaginationSize,
      component.INIT_SORT_NAME,
      component.INIT_SORT_DIR
    );
    expect(overviewSpy.getAll).toHaveBeenCalledTimes(1);
    expect(overviewSpy.getAll).toHaveBeenCalledWith(expectedOffsetPaginationEvent, undefined);
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

  it('should call service on register action of controls', () => {
    expect(overviewSpy.register).toHaveBeenCalledTimes(0);
    const saveControlItem = component.controls.find((control) => control.id === RegisterControlItem.ID);
    expect(saveControlItem).toBeTruthy();
    component.onControlsAction(saveControlItem);
    expect(overviewSpy.register).toHaveBeenCalledTimes(1);
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

  it('should call bound method on kypo table refresh output', () => {
    spyOn(component, 'onTableLoadEvent');
    expect(component.onTableLoadEvent).toHaveBeenCalledTimes(0);

    const kypoTableEl = fixture.debugElement.query(By.css(SENTINEL_TABLE_COMPONENT_SELECTOR));
    const expectedEvent: TableLoadEvent = { pagination: createPagination(), filter: 'someFilter' };

    kypoTableEl.triggerEventHandler('tableLoad', expectedEvent);
    expect(component.onTableLoadEvent).toHaveBeenCalledTimes(1);
    expect(component.onTableLoadEvent).toHaveBeenCalledWith(expectedEvent);
  });

  it('should call bound method on kypo controls action', () => {
    spyOn(component, 'onControlsAction');
    expect(component.onControlsAction).toHaveBeenCalledTimes(0);

    const kypoControlsEl = fixture.debugElement.query(By.css(SENTINEL_CONTROLS_COMPONENT_SELECTOR));
    const expectedEvent = new RegisterControlItem('', EMPTY, EMPTY);

    kypoControlsEl.triggerEventHandler('itemClicked', expectedEvent);
    expect(component.onControlsAction).toHaveBeenCalledTimes(1);
    expect(component.onControlsAction).toHaveBeenCalledWith(expectedEvent);
  });

  function createDefaultResource(): PaginatedResource<Microservice> {
    const microservices = [
      new Microservice('1', 'endpoint1', []),
      new Microservice('2', 'endpoint2', []),
      new Microservice('3', 'endpoint3', []),
    ];
    microservices.forEach((microservice, index) => {
      microservice.id = index;
      microservice.valid = true;
    });
    const pagination = new OffsetPagination(0, microservices.length, 5, microservices.length, 1);
    return new PaginatedResource<Microservice>(microservices, pagination);
  }
});
