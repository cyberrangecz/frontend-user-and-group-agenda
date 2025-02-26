import { skip, take } from 'rxjs/operators';
import { MicroserviceFilter } from '@crczp/user-and-group-agenda/internal';
import { Microservice } from '@crczp/user-and-group-model';
import { OffsetPagination, PaginatedResource } from '@sentinel/common/pagination';
import { of, throwError } from 'rxjs';
import { MicroserviceOverviewConcreteService } from './microservice-overview.concrete.service';
import { UserAndGroupContext } from '../../../internal/src/services/user-and-group-context.service';
import {
    UserAndGroupErrorHandler,
    UserAndGroupNavigator,
    UserAndGroupNotificationService,
} from '@crczp/user-and-group-agenda';
import { Router } from '@angular/router';
import { MicroserviceApi } from '@crczp/user-and-group-api';
import { inject, TestBed } from '@angular/core/testing';
import { MicroserviceOverviewService } from './microservice-overview.service';
import {
    createContextSpy,
    createErrorHandlerSpy,
    createMicroserviceApiSpy,
    createNavigatorSpy,
    createNotificationSpy,
    createPagination,
    createRouterSpy,
} from '../../../internal/src/testing/testing-commons.spec';

describe('MicroserviceOverviewConcreteService', () => {
    let service: MicroserviceOverviewService;
    let apiSpy: jasmine.SpyObj<MicroserviceApi>;
    let routerSpy: jasmine.SpyObj<Router>;
    let notificationSpy: jasmine.SpyObj<UserAndGroupNotificationService>;
    let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
    let navigatorSpy: jasmine.SpyObj<UserAndGroupNavigator>;
    let errorHandlerSpy: jasmine.SpyObj<UserAndGroupErrorHandler>;

    beforeEach(() => {
        apiSpy = createMicroserviceApiSpy();
        routerSpy = createRouterSpy();
        notificationSpy = createNotificationSpy();
        contextSpy = createContextSpy();
        navigatorSpy = createNavigatorSpy();
        errorHandlerSpy = createErrorHandlerSpy();
        TestBed.configureTestingModule({
            providers: [
                { provide: MicroserviceOverviewService, useClass: MicroserviceOverviewConcreteService },
                { provide: MicroserviceApi, useValue: apiSpy },
                { provide: Router, useValue: routerSpy },
                { provide: UserAndGroupNotificationService, useValue: notificationSpy },
                { provide: UserAndGroupContext, useValue: contextSpy },
                { provide: UserAndGroupNavigator, useValue: navigatorSpy },
                { provide: UserAndGroupErrorHandler, useValue: errorHandlerSpy },
            ],
        });
        service = TestBed.inject(MicroserviceOverviewService);
    });

    it('should ...', inject(
        [MicroserviceOverviewService],
        (microserviceOverviewService: MicroserviceOverviewService) => {
            expect(microserviceOverviewService).toBeTruthy();
        },
    ));

    it('should call api on getAll', () => {
        apiSpy.getAll.and.returnValue(of(createExpectedResource()));
        expect(apiSpy.getAll).toHaveBeenCalledTimes(0);
        const pagination = createPagination();
        const filterValue = 'someFilter';

        const expectedFilters = [new MicroserviceFilter(filterValue)];
        service.getAll(pagination, filterValue).pipe(take(1)).subscribe();
        expect(apiSpy.getAll).toHaveBeenCalledTimes(1);
        expect(apiSpy.getAll).toHaveBeenCalledWith(pagination, expectedFilters);
    });

    it('should update resource on getAll', (done) => {
        const expectedResource = createExpectedResource();
        apiSpy.getAll.and.returnValue(of(expectedResource));
        const pagination = createPagination();

        service.resource$.pipe(skip(1), take(1)).subscribe(
            (resource) => {
                expect(resource).toEqual(expectedResource);
                done();
            },
            () => fail(),
        );

        service.getAll(pagination).pipe(take(1)).subscribe();
    });

    it('should update hasError on getAll', (done) => {
        const expectedResource = createExpectedResource();
        apiSpy.getAll.and.returnValue(of(expectedResource));
        const pagination = createPagination();

        service.hasError$.pipe(skip(1), take(1)).subscribe(
            (hasError) => {
                expect(hasError).toBeFalsy();
                done();
            },
            () => fail(),
        );

        service.getAll(pagination).pipe(take(1)).subscribe();
    });

    it('should call error handler on getAll error', (done) => {
        const expectedErr = new ErrorEvent('test error');
        apiSpy.getAll.and.returnValue(throwError(expectedErr));
        const pagination = createPagination();
        expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(0);
        service
            .getAll(pagination)
            .pipe(take(1))
            .subscribe(
                () => fail(),
                (err) => {
                    expect(err).toEqual(expectedErr);
                    done();
                },
            );
    });

    it('should navigate to register microservice page', () => {
        const expectedPage = 'register';
        navigatorSpy.toNewMicroservice.and.returnValue(expectedPage);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
        expect(navigatorSpy.toNewMicroservice).toHaveBeenCalledTimes(0);

        service.register();
        expect(navigatorSpy.toNewMicroservice).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith([expectedPage]);
    });

    function createExpectedResource(): PaginatedResource<Microservice> {
        const microservices = [
            new Microservice('1', 'endpoint1', []),
            new Microservice('2', 'endpoint2', []),
            new Microservice('3', 'endpoint3', []),
        ];
        const pagination = new OffsetPagination(0, microservices.length, 5, microservices.length, 1);
        return new PaginatedResource<Microservice>(microservices, pagination);
    }
});
