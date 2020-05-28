import { TestBed } from '@angular/core/testing';
import { KypoPaginatedResource, KypoPagination } from 'kypo-common';
import { GroupApi, UserApi } from 'kypo-user-and-group-api';
import { Group, User } from 'kypo-user-and-group-model';
import { of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { GroupFilter } from '../../../model/filters/group-filter';
import { UserFilter } from '../../../model/filters/user-filter';
import {
  createContextSpy,
  createErrorHandlerSpy,
  createGroupApiSpy,
  createPagination,
  createUserApiSpy,
} from '../../../testing/testing-commons';
import { UserAndGroupErrorHandler } from '../../client/user-and-group-error-handler.service';
import { UserAndGroupContext } from '../../shared/user-and-group-context.service';
import { UserAssignConcreteService } from './user-assign-concrete.service';
import { UserAssignService } from './user-assign.service';

describe('UserAssignConcreteService', () => {
  let service: UserAssignService;
  let userApiSpy: jasmine.SpyObj<UserApi>;
  let groupApiSpy: jasmine.SpyObj<GroupApi>;
  let contextSpy: jasmine.SpyObj<UserAndGroupContext>;
  let errorHandlerSpy: jasmine.SpyObj<UserAndGroupErrorHandler>;

  beforeEach(() => {
    userApiSpy = createUserApiSpy();
    groupApiSpy = createGroupApiSpy();
    contextSpy = createContextSpy();
    errorHandlerSpy = createErrorHandlerSpy();
    TestBed.configureTestingModule({
      providers: [
        { provide: UserAssignService, useClass: UserAssignConcreteService },
        { provide: UserApi, useValue: userApiSpy },
        { provide: GroupApi, useValue: groupApiSpy },
        { provide: UserAndGroupContext, useValue: contextSpy },
        { provide: UserAndGroupErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(UserAssignService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call api on assign', (done) => {
    const resourceId = 1;
    const users = createUsers().elements;
    const groups = createGroups().elements;
    const expectedUserIds = users.map((user) => user.id);
    const expectedGroupIds = groups.map((group) => group.id);
    groupApiSpy.addUsersToGroup.and.returnValue(of(true));
    userApiSpy.getUsersInGroups.and.returnValue(of(createUsers()));
    expect(groupApiSpy.addUsersToGroup).toHaveBeenCalledTimes(0);

    service
      .assign(resourceId, users, groups)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.addUsersToGroup).toHaveBeenCalledTimes(1);
          expect(groupApiSpy.addUsersToGroup).toHaveBeenCalledWith(resourceId, expectedUserIds, expectedGroupIds);
          done();
        },
        (_) => fail()
      );
  });

  it('should call api on unassign', (done) => {
    const resourceId = 1;
    const users = createUsers().elements;
    const expectedUserIds = users.map((user) => user.id);
    groupApiSpy.removeUsersFromGroup.and.returnValue(of(true));
    userApiSpy.getUsersInGroups.and.returnValue(of(createUsers()));
    expect(groupApiSpy.removeUsersFromGroup).toHaveBeenCalledTimes(0);

    service
      .unassign(resourceId, users)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.removeUsersFromGroup).toHaveBeenCalledTimes(1);
          expect(groupApiSpy.removeUsersFromGroup).toHaveBeenCalledWith(resourceId, expectedUserIds);
          done();
        },
        (_) => fail()
      );
  });

  it('should update observable on selection of assigned users', (done) => {
    const expectedUsers = createUsers().elements;
    service.selectedAssignedUsers$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual(expectedUsers);
        done();
      },
      (_) => fail()
    );
    service.setSelectedAssignedUsers(expectedUsers);
  });

  it('should update observable on selection of users to assign', (done) => {
    const expectedUsers = createUsers().elements;
    service.selectedUsersToAssign$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual(expectedUsers);
        done();
      },
      (_) => fail()
    );
    service.setSelectedUsersToAssign(expectedUsers);
  });

  it('should update observable on clear selection of assigned users', (done) => {
    service.selectedAssignedUsers$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual([]);
        done();
      },
      (_) => fail()
    );
    service.clearSelectedAssignedUsers();
  });

  it('should update observable on clear selection of users to assign', (done) => {
    service.selectedUsersToAssign$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual([]);
        done();
      },
      (_) => fail()
    );
    service.clearSelectedUsersToAssign();
  });

  it('should update observable on selection of groups to import', (done) => {
    const expectedGroups = createGroups().elements;
    service.selectedGroupsToImport$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual(expectedGroups);
        done();
      },
      (_) => fail()
    );
    service.setSelectedGroupsToImport(expectedGroups);
  });

  it('should update observable on clear selection of groups to import', (done) => {
    service.selectedGroupsToImport$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual([]);
        done();
      },
      (_) => fail()
    );
    service.clearSelectedGroupsToImport();
  });

  it('should call api on assign selected', (done) => {
    const resourceId = 1;
    const users = createUsers().elements;
    const groups = createGroups().elements;
    const expectedUserIds = users.map((user) => user.id);
    const expectedGroupIds = groups.map((group) => group.id);
    groupApiSpy.addUsersToGroup.and.returnValue(of(true));
    userApiSpy.getUsersInGroups.and.returnValue(of(createUsers()));
    expect(groupApiSpy.addUsersToGroup).toHaveBeenCalledTimes(0);

    service.setSelectedUsersToAssign(users);
    service.setSelectedGroupsToImport(groups);
    service
      .assignSelected(resourceId)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.addUsersToGroup).toHaveBeenCalledTimes(1);
          expect(groupApiSpy.addUsersToGroup).toHaveBeenCalledWith(resourceId, expectedUserIds, expectedGroupIds);
          done();
        },
        (_) => fail()
      );
  });

  it('should call api on unassign selected', (done) => {
    const resourceId = 1;
    const users = createUsers().elements;
    const expectedUserIds = users.map((user) => user.id);
    groupApiSpy.removeUsersFromGroup.and.returnValue(of(true));
    userApiSpy.getUsersInGroups.and.returnValue(of(createUsers()));
    expect(groupApiSpy.removeUsersFromGroup).toHaveBeenCalledTimes(0);

    service.setSelectedAssignedUsers(users);
    service
      .unassignSelected(resourceId)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.removeUsersFromGroup).toHaveBeenCalledTimes(1);
          expect(groupApiSpy.removeUsersFromGroup).toHaveBeenCalledWith(resourceId, expectedUserIds);
          done();
        },
        (_) => fail()
      );
  });

  it('should call api on get assigned', (done) => {
    const resourceId = 1;
    const pagination = createPagination();
    const filterValue = 'sometestfilter';
    const expectedFilter = [new UserFilter(filterValue)];
    userApiSpy.getUsersInGroups.and.returnValue(of(createUsers()));
    expect(userApiSpy.getUsersInGroups).toHaveBeenCalledTimes(0);

    service
      .getAssigned(resourceId, pagination, filterValue)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(userApiSpy.getUsersInGroups).toHaveBeenCalledTimes(1);
          expect(userApiSpy.getUsersInGroups).toHaveBeenCalledWith([resourceId], pagination, expectedFilter);
          done();
        },
        (_) => fail()
      );
  });

  it('should call error handler on get assigned error', (done) => {
    const resourceId = 1;
    const pagination = createPagination();
    const filterValue = 'sometestfilter';
    userApiSpy.getUsersInGroups.and.returnValue(throwError({ status: 400 }));
    expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(0);

    service
      .getAssigned(resourceId, pagination, filterValue)
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

  it('should update observable on get assigned', (done) => {
    const resourceId = 1;
    const pagination = createPagination();
    const filterValue = 'sometestfilter';
    const expectedUsers = createUsers();
    userApiSpy.getUsersInGroups.and.returnValue(of(expectedUsers));

    service.assignedUsers$.pipe(skip(1), take(1)).subscribe(
      (user) => {
        expect(user).toEqual(expectedUsers);
        done();
      },
      (_) => fail()
    );

    service.getAssigned(resourceId, pagination, filterValue).pipe(take(1)).subscribe();
  });

  it('should call api on get users to assign', (done) => {
    const resourceId = 1;
    const filterValue = 'sometestfilter';
    const expectedFilter = [new UserFilter(filterValue)];
    userApiSpy.getUsersNotInGroup.and.returnValue(of(createUsers()));
    expect(userApiSpy.getUsersNotInGroup).toHaveBeenCalledTimes(0);

    service
      .getUsersToAssign(resourceId, filterValue)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(userApiSpy.getUsersNotInGroup).toHaveBeenCalledTimes(1);
          expect(userApiSpy.getUsersNotInGroup).toHaveBeenCalledWith(resourceId, jasmine.anything(), expectedFilter);
          done();
        },
        (_) => fail()
      );
  });

  it('should call error handler on get users to assign error', (done) => {
    const resourceId = 1;
    const filterValue = 'sometestfilter';
    userApiSpy.getUsersNotInGroup.and.returnValue(throwError({ status: 400 }));
    expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(0);

    service
      .getUsersToAssign(resourceId, filterValue)
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

  it('should call api on get groups to import', (done) => {
    const filterValue = 'sometestfilter';
    const expectedFilter = [new GroupFilter(filterValue)];
    groupApiSpy.getAll.and.returnValue(of(createGroups()));
    expect(groupApiSpy.getAll).toHaveBeenCalledTimes(0);

    service
      .getGroupsToImport(filterValue)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.getAll).toHaveBeenCalledTimes(1);
          expect(groupApiSpy.getAll).toHaveBeenCalledWith(jasmine.anything(), expectedFilter);
          done();
        },
        (_) => fail()
      );
  });

  it('should call error handler on get groups to import error', (done) => {
    const filterValue = 'sometestfilter';
    groupApiSpy.getAll.and.returnValue(throwError({ status: 400 }));
    expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(0);

    service
      .getGroupsToImport(filterValue)
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

  function createUsers(): KypoPaginatedResource<User> {
    const users = [new User(), new User(), new User()];
    users.forEach((user, index) => (user.id = index));
    const pagination = new KypoPagination(0, users.length, 5, users.length, 1);
    return new KypoPaginatedResource<User>(users, pagination);
  }

  function createGroups(): KypoPaginatedResource<Group> {
    const groups = [new Group(), new Group(), new Group()];
    groups.forEach((group, index) => (group.id = index));
    const pagination = new KypoPagination(0, groups.length, 5, groups.length, 1);
    return new KypoPaginatedResource<Group>(groups, pagination);
  }
});
