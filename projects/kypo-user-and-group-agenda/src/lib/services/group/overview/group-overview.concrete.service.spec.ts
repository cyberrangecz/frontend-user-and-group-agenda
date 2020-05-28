import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CsirtMuDialogResultEnum } from 'csirt-mu-common';
import { KypoPaginatedResource, KypoPagination } from 'kypo-common';
import { GroupApi } from 'kypo-user-and-group-api';
import { Group } from 'kypo-user-and-group-model';
import { of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { GroupFilter } from '../../../model/filters/group-filter';
import {
  createContextSpy,
  createErrorHandlerSpy,
  createGroupApiSpy,
  createMatDialogSpy,
  createNavigatorSpy,
  createNotificationSpy,
  createPagination,
  createRouterSpy,
} from '../../../testing/testing-commons';
import { UserAndGroupErrorHandler } from '../../client/user-and-group-error-handler.service';
import { UserAndGroupNavigator } from '../../client/user-and-group-navigator.service';
import { UserAndGroupNotificationService } from '../../client/user-and-group-notification.service';
import { UserAndGroupContext } from '../../shared/user-and-group-context.service';
import { GroupOverviewConcreteService } from './group-overview.concrete.service';
import { GroupOverviewService } from './group-overview.service';

describe('GroupOverviewConcreteService', () => {
  let service: GroupOverviewService;
  let apiSpy: jasmine.SpyObj<GroupApi>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationSpy: jasmine.SpyObj<UserAndGroupNotificationService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
  let navigatorSpy: jasmine.SpyObj<UserAndGroupNavigator>;
  let errorHandlerSpy: jasmine.SpyObj<UserAndGroupErrorHandler>;

  beforeEach(() => {
    apiSpy = createGroupApiSpy();
    routerSpy = createRouterSpy();
    notificationSpy = createNotificationSpy();
    dialogSpy = createMatDialogSpy();
    contextSpy = createContextSpy();
    navigatorSpy = createNavigatorSpy();
    errorHandlerSpy = createErrorHandlerSpy();
    TestBed.configureTestingModule({
      providers: [
        { provide: GroupOverviewService, useClass: GroupOverviewConcreteService },
        { provide: GroupApi, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserAndGroupNotificationService, useValue: notificationSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: UserAndGroupContext, useValue: contextSpy },
        { provide: UserAndGroupNavigator, useValue: navigatorSpy },
        { provide: UserAndGroupErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(GroupOverviewService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call api on getAll', () => {
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    expect(apiSpy.getAll).toHaveBeenCalledTimes(0);
    const pagination = createPagination();
    const filterValue = 'someFilter';

    const expectedFilters = [new GroupFilter(filterValue)];
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
      (err) => fail()
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
      (err) => fail()
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
        (_) => fail(),
        (err) => {
          expect(err).toEqual(expectedErr);
          done();
        }
      );
  });

  it('should navigate to edit group page on edit', () => {
    const expectedPage = 'groupedit';
    navigatorSpy.toGroupEdit.and.returnValue(expectedPage);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
    expect(navigatorSpy.toGroupEdit).toHaveBeenCalledTimes(0);
    const group = new Group();
    group.id = 1;

    service.edit(group);
    expect(navigatorSpy.toGroupEdit).toHaveBeenCalledTimes(1);
    expect(navigatorSpy.toGroupEdit).toHaveBeenCalledWith(group.id);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith([expectedPage]);
  });

  it('should navigate to new group page on create', () => {
    const expectedPage = 'groupnew';
    navigatorSpy.toNewGroup.and.returnValue(expectedPage);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
    expect(navigatorSpy.toNewGroup).toHaveBeenCalledTimes(0);

    service.create();
    expect(navigatorSpy.toNewGroup).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith([expectedPage]);
  });

  it('should open dialog and call api if confirmed on delete', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const groupToDelete = new Group();
    groupToDelete.id = 1;

    service
      .delete(groupToDelete)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledWith([groupToDelete.id]);
          done();
        },
        (_) => fail()
      );
  });

  it('should open dialog and not call api if dismissed on delete', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.DISMISSED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const groupToDelete = new Group();
    groupToDelete.id = 1;

    service
      .delete(groupToDelete)
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (_) => fail(),
        () => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
          done();
        }
      );
  });

  it('should open dialog and call api if confirmed on delete selected', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const groupToDelete = new Group();
    groupToDelete.id = 1;
    service.setSelection([groupToDelete]);

    service
      .deleteSelected()
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledWith([groupToDelete.id]);
          done();
        },
        (_) => fail()
      );
  });

  it('should open dialog and not call api if dismissed on delete selected', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.DISMISSED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const groupToDelete = new Group();
    groupToDelete.id = 1;
    service.setSelection([groupToDelete]);

    service
      .delete(groupToDelete)
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (_) => fail(),
        () => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
          done();
        }
      );
  });

  it('should reload data after delete', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    const groupToDelete = new Group();
    groupToDelete.id = 1;

    service
      .delete(groupToDelete)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(apiSpy.getAll).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail()
      );
  });

  it('should reload data after delete selected', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(CsirtMuDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    const groupToDelete = new Group();
    groupToDelete.id = 1;
    service.setSelection([groupToDelete]);

    service
      .deleteSelected()
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(apiSpy.getAll).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail()
      );
  });

  function createExpectedResource(): KypoPaginatedResource<Group> {
    const groups = [new Group(), new Group(), new Group()];
    const pagination = new KypoPagination(0, groups.length, 5, groups.length, 1);
    return new KypoPaginatedResource<Group>(groups, pagination);
  }
});
