import { TestBed } from '@angular/core/testing';
import { KypoPaginatedResource, KypoPagination } from 'kypo-common';
import { GroupApi, RoleApi } from 'kypo-user-and-group-api';
import { UserRole } from 'kypo-user-and-group-model';
import { of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { RoleFilter } from '../../../model/filters/role-filter';
import {
  createErrorHandlerSpy,
  createGroupApiSpy,
  createPagination,
  createRoleApiSpy,
} from '../../../testing/testing-commons';
import { UserAndGroupErrorHandler } from '../../client/user-and-group-error-handler.service';
import { RoleAssignConcreteService } from './role-assign-concrete.service';
import { RoleAssignService } from './role-assign.service';

describe('RoleAssignConcreteService', () => {
  let service: RoleAssignService;
  let roleApiSpy: jasmine.SpyObj<RoleApi>;
  let groupApiSpy: jasmine.SpyObj<GroupApi>;
  let errorHandlerSpy: jasmine.SpyObj<UserAndGroupErrorHandler>;

  beforeEach(() => {
    roleApiSpy = createRoleApiSpy();
    groupApiSpy = createGroupApiSpy();
    errorHandlerSpy = createErrorHandlerSpy();
    TestBed.configureTestingModule({
      providers: [
        { provide: RoleAssignService, useClass: RoleAssignConcreteService },
        { provide: RoleApi, useValue: roleApiSpy },
        { provide: GroupApi, useValue: groupApiSpy },
        { provide: UserAndGroupErrorHandler, useValue: errorHandlerSpy },
      ],
    });
    service = TestBed.inject(RoleAssignService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should call api on assign', (done) => {
    const resourceId = 1;
    const resource = createResource();
    const roles = resource.elements;
    groupApiSpy.assignRole.and.returnValue(of(true));
    groupApiSpy.getRolesOfGroup.and.returnValue(of(resource));
    expect(groupApiSpy.assignRole).toHaveBeenCalledTimes(0);

    service
      .assign(resourceId, roles)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.assignRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        (_) => fail()
      );
  });

  it('should call api on unassign', (done) => {
    const resourceId = 1;
    const resource = createResource();
    const roles = resource.elements;
    groupApiSpy.removeRole.and.returnValue(of(true));
    groupApiSpy.getRolesOfGroup.and.returnValue(of(resource));
    expect(groupApiSpy.removeRole).toHaveBeenCalledTimes(0);

    service
      .unassign(resourceId, roles)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.removeRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        (_) => fail()
      );
  });

  it('should update observable on selection of assigned roles', (done) => {
    const expectedRoles = createResource().elements;
    service.selectedAssignedRoles$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual(expectedRoles);
        done();
      },
      (_) => fail()
    );
    service.setSelectedAssignedRoles(expectedRoles);
  });

  it('should update observable on selection of roles to assign', (done) => {
    const expectedRoles = createResource().elements;
    service.selectedRolesToAssign$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual(expectedRoles);
        done();
      },
      (_) => fail()
    );
    service.setSelectedRolesToAssign(expectedRoles);
  });

  it('should update observable on clear selection of assigned roles', (done) => {
    service.selectedAssignedRoles$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual([]);
        done();
      },
      (_) => fail()
    );
    service.clearSelectedAssignedRoles();
  });

  it('should update observable on clear selection of roles to assign', (done) => {
    service.selectedRolesToAssign$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual([]);
        done();
      },
      (_) => fail()
    );
    service.clearSelectedRolesToAssign();
  });

  it('should call api on assign selected', (done) => {
    const resourceId = 1;
    const resource = createResource();
    const roles = resource.elements;
    groupApiSpy.assignRole.and.returnValue(of(true));
    groupApiSpy.getRolesOfGroup.and.returnValue(of(resource));
    expect(groupApiSpy.addUsersToGroup).toHaveBeenCalledTimes(0);

    service.setSelectedRolesToAssign(roles);
    service
      .assignSelected(resourceId)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.assignRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        (_) => fail()
      );
  });

  it('should call api on unassign selected', (done) => {
    const resourceId = 1;
    const resource = createResource();
    const roles = resource.elements;
    groupApiSpy.removeRole.and.returnValue(of(true));
    groupApiSpy.getRolesOfGroup.and.returnValue(of(resource));
    expect(groupApiSpy.removeRole).toHaveBeenCalledTimes(0);

    service.setSelectedAssignedRoles(roles);
    service
      .unassignSelected(resourceId)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.removeRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        (_) => fail()
      );
  });

  it('should call api on get assigned', (done) => {
    const resourceId = 1;
    const pagination = createPagination();
    const filterValue = 'sometestfilter';
    groupApiSpy.getRolesOfGroup.and.returnValue(of(createResource()));
    expect(groupApiSpy.getRolesOfGroup).toHaveBeenCalledTimes(0);

    service
      .getAssigned(resourceId, pagination, filterValue)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(groupApiSpy.getRolesOfGroup).toHaveBeenCalledTimes(1);
          expect(groupApiSpy.getRolesOfGroup).toHaveBeenCalledWith(resourceId, pagination, jasmine.anything());
          done();
        },
        (_) => fail()
      );
  });

  it('should call error handler on get assigned error', (done) => {
    const resourceId = 1;
    const pagination = createPagination();
    const filterValue = 'sometestfilter';
    groupApiSpy.getRolesOfGroup.and.returnValue(throwError({ status: 400 }));
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
    const expectedRoles = createResource();
    groupApiSpy.getRolesOfGroup.and.returnValue(of(expectedRoles));

    service.assignedRoles$.pipe(skip(1), take(1)).subscribe(
      (role) => {
        expect(role).toEqual(expectedRoles);
        done();
      },
      (_) => fail()
    );

    service.getAssigned(resourceId, pagination, filterValue).pipe(take(1)).subscribe();
  });

  it('should call api on get roles to assign', (done) => {
    const filterValue = 'sometestfilter';
    const expectedFilter = [new RoleFilter(filterValue)];
    roleApiSpy.getAll.and.returnValue(of(createResource()));
    expect(roleApiSpy.getAll).toHaveBeenCalledTimes(0);

    service
      .getAvailableToAssign(filterValue)
      .pipe(take(1))
      .subscribe(
        (_) => {
          expect(roleApiSpy.getAll).toHaveBeenCalledTimes(1);
          expect(roleApiSpy.getAll).toHaveBeenCalledWith(jasmine.anything(), expectedFilter);
          done();
        },
        (_) => fail()
      );
  });

  it('should call error handler on get roles to assign error', (done) => {
    const filterValue = 'sometestfilter';
    roleApiSpy.getAll.and.returnValue(throwError({ status: 400 }));
    expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(0);

    service
      .getAvailableToAssign(filterValue)
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

  function createResource(): KypoPaginatedResource<UserRole> {
    const roles = [new UserRole(), new UserRole(), new UserRole()];
    roles.forEach((role, index) => (role.id = index));
    const pagination = new KypoPagination(0, roles.length, 5, roles.length, 1);
    return new KypoPaginatedResource<UserRole>(roles, pagination);
  }
});
