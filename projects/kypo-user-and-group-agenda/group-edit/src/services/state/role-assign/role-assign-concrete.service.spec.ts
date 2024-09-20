import { TestBed } from '@angular/core/testing';
import { PaginatedResource, OffsetPagination } from '@sentinel/common/pagination';
import { GroupApi, RoleApi } from '@muni-kypo-crp/user-and-group-api';
import { UserRole } from '@muni-kypo-crp/user-and-group-model';
import { of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { RoleFilter } from '@muni-kypo-crp/user-and-group-agenda/internal';
import {
  createErrorHandlerSpy,
  createGroupApiSpy,
  createPagination,
  createRoleApiSpy,
} from '../../../../../internal/src/testing/testing-commons.spec';
import { UserAndGroupErrorHandler } from '@muni-kypo-crp/user-and-group-agenda';
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
        () => {
          expect(groupApiSpy.assignRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        () => fail()
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
        () => {
          expect(groupApiSpy.removeRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        () => fail()
      );
  });

  it('should update observable on selection of assigned roles', (done) => {
    const expectedRoles = createResource().elements;
    service.selectedAssignedRoles$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual(expectedRoles);
        done();
      },
      () => fail()
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
      () => fail()
    );
    service.setSelectedRolesToAssign(expectedRoles);
  });

  it('should update observable on clear selection of assigned roles', (done) => {
    service.selectedAssignedRoles$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual([]);
        done();
      },
      () => fail()
    );
    service.clearSelectedAssignedRoles();
  });

  it('should update observable on clear selection of roles to assign', (done) => {
    service.selectedRolesToAssign$.pipe(skip(1), take(1)).subscribe(
      (selected) => {
        expect(selected).toEqual([]);
        done();
      },
      () => fail()
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
        () => {
          expect(groupApiSpy.assignRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        () => fail()
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
        () => {
          expect(groupApiSpy.removeRole).toHaveBeenCalledTimes(roles.length);
          done();
        },
        () => fail()
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
        () => {
          expect(groupApiSpy.getRolesOfGroup).toHaveBeenCalledTimes(1);
          expect(groupApiSpy.getRolesOfGroup).toHaveBeenCalledWith(resourceId, pagination, jasmine.anything());
          done();
        },
        () => fail()
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
        () => fail(),
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
      () => fail()
    );

    service.getAssigned(resourceId, pagination, filterValue).pipe(take(1)).subscribe();
  });

  it('should call api on get roles to assign', (done) => {
    const resourceId = 1;
    const filterValue = 'sometestfilter';
    const expectedFilter = [new RoleFilter(filterValue)];
    roleApiSpy.getAll.and.returnValue(of(createResource()));
    expect(roleApiSpy.getAll).toHaveBeenCalledTimes(0);

    service
      .getAvailableToAssign(resourceId, filterValue)
      .pipe(take(1))
      .subscribe(
        () => {
          expect(roleApiSpy.getAll).toHaveBeenCalledTimes(1);
          expect(roleApiSpy.getAll).toHaveBeenCalledWith(jasmine.anything(), expectedFilter);
          done();
        },
        () => fail()
      );
  });

  it('should call error handler on get roles to assign error', (done) => {
    const resourceId = 1;
    const filterValue = 'sometestfilter';
    roleApiSpy.getAll.and.returnValue(throwError({ status: 400 }));
    expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(0);

    service
      .getAvailableToAssign(resourceId, filterValue)
      .pipe(take(1))
      .subscribe(
        () => fail(),
        (err) => {
          expect(errorHandlerSpy.emit).toHaveBeenCalledTimes(1);
          expect(errorHandlerSpy.emit).toHaveBeenCalledWith(err, jasmine.anything());
          done();
        }
      );
  });

  function createResource(): PaginatedResource<UserRole> {
    const roles = [new UserRole(), new UserRole(), new UserRole()];
    roles.forEach((role, index) => (role.id = index));
    const pagination = new OffsetPagination(0, roles.length, 5, roles.length, 1);
    return new PaginatedResource<UserRole>(roles, pagination);
  }
});
