import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GroupApi } from '@kypo/user-and-group-api';
import { Group } from '@kypo/user-and-group-model';
import { of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { GroupChangedEvent } from '../../model/group-changed-event';
import {
  createErrorHandlerSpy,
  createGroupApiSpy,
  createNavigatorSpy,
  createNotificationSpy,
  createRouterSpy,
} from '../../../../internal/src/testing/testing-commons';
import { UserAndGroupErrorHandler } from '@kypo/user-and-group-agenda';
import { UserAndGroupNavigator } from '@kypo/user-and-group-agenda';
import { UserAndGroupNotificationService } from '@kypo/user-and-group-agenda';
import { GroupEditConcreteService } from './group-edit-concrete.service';
import { GroupEditService } from './group-edit.service';

describe('GroupEditConcreteService', () => {
  let service: GroupEditService;
  let apiSpy: jasmine.SpyObj<GroupApi>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationSpy: jasmine.SpyObj<UserAndGroupNotificationService>;
  let navigatorSpy: jasmine.SpyObj<UserAndGroupNavigator>;
  let errorHandlerSpy: jasmine.SpyObj<UserAndGroupErrorHandler>;

  beforeEach(() => {
    apiSpy = createGroupApiSpy();
    routerSpy = createRouterSpy();
    notificationSpy = createNotificationSpy();
    navigatorSpy = createNavigatorSpy();
    errorHandlerSpy = createErrorHandlerSpy();
    TestBed.configureTestingModule({
      providers: [
        { provide: GroupEditService, useClass: GroupEditConcreteService },
        { provide: GroupApi, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserAndGroupNotificationService, useValue: notificationSpy },
        { provide: UserAndGroupNavigator, useValue: navigatorSpy },
        { provide: UserAndGroupErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(GroupEditService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should set state mode to false if no initial group-overview is provided', (done) => {
    service.editMode$.pipe(skip(1), take(1)).subscribe(
      (editMode) => {
        expect(editMode).toBeFalsy();
        done();
      },
      (_) => fail()
    );
    service.set(undefined);
  });

  it('should set state mode if initial group-overview is provided', (done) => {
    const group = new Group();
    service.editMode$.pipe(skip(1), take(1)).subscribe(
      (editMode) => {
        expect(editMode).toBeTruthy();
        done();
      },
      (_) => fail()
    );
    service.set(group);
  });

  it('should emit group-overview when new one is set', (done) => {
    const group = new Group();
    group.id = 1;
    service.group$.pipe(take(1)).subscribe(
      (emittedGroup) => {
        expect(emittedGroup).toEqual(group);
        done();
      },
      (_) => fail()
    );
    service.set(group);
  });

  it('should emit save disabled on change event', (done) => {
    const group = new Group();
    group.id = 1;
    const isGroupValid = true;
    const changeEvent = new GroupChangedEvent(group, isGroupValid);

    service.saveDisabled$.pipe(skip(1), take(1)).subscribe(
      (saveDisabled) => {
        expect(saveDisabled).not.toEqual(isGroupValid);
        done();
      },
      (_) => fail()
    );
    service.change(changeEvent);
  });

  it('should navigate to state page on create and state', (done) => {
    const expectedId = 1;
    const expectedRoute = 'groupeditpage';
    apiSpy.create.and.returnValue(of(expectedId));
    navigatorSpy.toGroupEdit.and.returnValue(expectedRoute);
    expect(apiSpy.create).toHaveBeenCalledTimes(0);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
    expect(navigatorSpy.toGroupEdit).toHaveBeenCalledTimes(0);
    expect(notificationSpy.emit).toHaveBeenCalledTimes(0);

    service
      .createAndEdit()
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(apiSpy.create).toHaveBeenCalledTimes(1);
          expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
          expect(routerSpy.navigate).toHaveBeenCalledWith([expectedRoute]);
          expect(navigatorSpy.toGroupEdit).toHaveBeenCalledTimes(1);
          expect(navigatorSpy.toGroupEdit).toHaveBeenCalledWith(expectedId);
          expect(notificationSpy.emit).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail()
      );
  });

  it('should call update api and stay on the page on save in state mode', (done) => {
    const editedGroup = new Group();
    editedGroup.id = 1;
    apiSpy.update.and.returnValue(of(editedGroup.id));
    expect(apiSpy.update).toHaveBeenCalledTimes(0);
    expect(apiSpy.create).toHaveBeenCalledTimes(0);
    expect(notificationSpy.emit).toHaveBeenCalledTimes(0);

    service.set(editedGroup);
    service
      .save()
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(apiSpy.create).toHaveBeenCalledTimes(0);
          expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
          expect(apiSpy.update).toHaveBeenCalledTimes(1);
          expect(notificationSpy.emit).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail()
      );
  });

  it('should call create api and navigate to overview page on save not in state mode', (done) => {
    apiSpy.create.and.returnValue(of(1));
    expect(apiSpy.create).toHaveBeenCalledTimes(0);
    expect(apiSpy.update).toHaveBeenCalledTimes(0);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(0);
    expect(navigatorSpy.toGroupOverview).toHaveBeenCalledTimes(0);
    expect(notificationSpy.emit).toHaveBeenCalledTimes(0);

    service.set(undefined);
    service
      .save()
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(apiSpy.update).toHaveBeenCalledTimes(0);
          expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
          expect(navigatorSpy.toGroupOverview).toHaveBeenCalledTimes(1);
          expect(apiSpy.create).toHaveBeenCalledTimes(1);
          expect(notificationSpy.emit).toHaveBeenCalledTimes(1);
          done();
        },
        (_) => fail()
      );
  });

  it('should call error handler on error save in state mode', (done) => {
    const editedGroup = new Group();
    editedGroup.id = 1;
    apiSpy.update.and.returnValue(throwError({ status: 400 }));
    service.set(editedGroup);
    service
      .save()
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (err) => {
          expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
          expect(errorHandlerSpy.emit).toHaveBeenCalledWith(err, jasmine.anything());
          done();
        }
      );
  });

  it('should call error handler on error save not in state mode', (done) => {
    apiSpy.create.and.returnValue(throwError({ status: 400 }));
    service.set(undefined);
    service
      .save()
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (err) => {
          expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
          expect(errorHandlerSpy.emit).toHaveBeenCalledWith(err, jasmine.anything());
          done();
        }
      );
  });

  it('should call error handler on error in createAndEdit', (done) => {
    apiSpy.create.and.returnValue(throwError({ status: 400 }));
    service.set(undefined);
    service
      .createAndEdit()
      .pipe(take(1))
      .subscribe(
        (_) => fail(),
        (err) => {
          expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
          expect(errorHandlerSpy.emit).toHaveBeenCalledWith(err, jasmine.anything());
          done();
        }
      );
  });
});
