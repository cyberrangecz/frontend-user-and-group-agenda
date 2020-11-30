import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SentinelDialogResultEnum } from '@sentinel/components/dialogs';
import { PaginatedResource, SentinelPagination } from '@sentinel/common';
import { UserApi } from 'kypo-user-and-group-api';
import { User } from 'kypo-user-and-group-model';
import { of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { UserFilter } from '@kypo/user-and-group-agenda/internal';
import {
  createContextSpy,
  createErrorHandlerSpy,
  createMatDialogSpy,
  createNotificationSpy,
  createPagination,
  createUserApiSpy,
} from '../../../../internal/src/testing/testing-commons';
import { UserAndGroupErrorHandler } from '@kypo/user-and-group-agenda';
import { UserAndGroupNotificationService } from '@kypo/user-and-group-agenda';
import { UserAndGroupContext } from '@kypo/user-and-group-agenda/internal';
import { UserOverviewConcreteService } from './user-overview-concrete.service';
import { UserOverviewService } from './user-overview.service';

describe('UserOverviewConcreteService', () => {
  let service: UserOverviewService;
  let apiSpy: jasmine.SpyObj<UserApi>;
  let notificationSpy: jasmine.SpyObj<UserAndGroupNotificationService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
  let errorHandlerSpy: jasmine.SpyObj<UserAndGroupErrorHandler>;

  beforeEach(() => {
    apiSpy = createUserApiSpy();
    notificationSpy = createNotificationSpy();
    dialogSpy = createMatDialogSpy();
    contextSpy = createContextSpy();
    errorHandlerSpy = createErrorHandlerSpy();
    TestBed.configureTestingModule({
      providers: [
        { provide: UserOverviewService, useClass: UserOverviewConcreteService },
        { provide: UserApi, useValue: apiSpy },
        { provide: UserAndGroupNotificationService, useValue: notificationSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: UserAndGroupContext, useValue: contextSpy },
        { provide: UserAndGroupErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(UserOverviewService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call api on getAll', () => {
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    expect(apiSpy.getAll).toHaveBeenCalledTimes(0);
    const pagination = createPagination();
    const filterValue = 'someFilter';

    const expectedFilters = [new UserFilter(filterValue)];
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

  it('should open dialog and call api if confirmed on delete', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const userToDelete = new User();
    userToDelete.id = 1;

    service
      .delete(userToDelete)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledWith([userToDelete.id]);
          done();
        },
        (_) => fail()
      );
  });

  it('should open dialog and not call api if dismissed on delete', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.DISMISSED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const userToDelete = new User();
    userToDelete.id = 1;

    service
      .delete(userToDelete)
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
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const userToDelete = new User();
    userToDelete.id = 1;
    service.setSelection([userToDelete]);

    service
      .deleteSelected()
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(dialogSpy.open).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(1);
          expect(apiSpy.deleteMultiple).toHaveBeenCalledWith([userToDelete.id]);
          done();
        },
        (_) => fail()
      );
  });

  it('should open dialog and not call api if dismissed on delete selected', (done) => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.DISMISSED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    expect(apiSpy.deleteMultiple).toHaveBeenCalledTimes(0);
    const userToDelete = new User();
    userToDelete.id = 1;
    service.setSelection([userToDelete]);

    service
      .delete(userToDelete)
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
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    const userToDelete = new User();
    userToDelete.id = 1;

    service
      .delete(userToDelete)
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
    dialogSpy.open.and.returnValue({ afterClosed: () => of(SentinelDialogResultEnum.CONFIRMED) } as any);
    apiSpy.getAll.and.returnValue(of(createExpectedResource()));
    apiSpy.deleteMultiple.and.returnValue(of(true));
    const userToDelete = new User();
    userToDelete.id = 1;
    service.setSelection([userToDelete]);

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

  function createExpectedResource(): PaginatedResource<User> {
    const users = [new User(), new User(), new User()];
    const pagination = new SentinelPagination(0, users.length, 5, users.length, 1);
    return new PaginatedResource<User>(users, pagination);
  }
});
