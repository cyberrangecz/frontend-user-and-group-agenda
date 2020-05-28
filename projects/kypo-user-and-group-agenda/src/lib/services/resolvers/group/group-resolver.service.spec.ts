import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ParamMap, Router, RouterStateSnapshot } from '@angular/router';
import { GroupApi } from 'kypo-user-and-group-api';
import { Group } from 'kypo-user-and-group-model';
import { Observable, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { GROUP_NEW_PATH, GROUP_PATH, GROUP_SELECTOR } from '../../../model/client/default-paths';
import {
  createErrorHandlerSpy,
  createGroupApiSpy,
  createNavigatorSpy,
  createRouterSpy,
} from '../../../testing/testing-commons';
import { UserAndGroupErrorHandler } from '../../client/user-and-group-error-handler.service';
import { UserAndGroupNavigator } from '../../client/user-and-group-navigator.service';
import { GroupResolver } from './group-resolver.service';

describe('GroupResolver', () => {
  let resolver: GroupResolver;
  let routerSpy: jasmine.SpyObj<Router>;
  let groupApiSpy: jasmine.SpyObj<GroupApi>;
  let errorHandler: jasmine.SpyObj<UserAndGroupErrorHandler>;
  let navigatorSpy: jasmine.SpyObj<UserAndGroupNavigator>;

  beforeEach(() => {
    routerSpy = createRouterSpy();
    groupApiSpy = createGroupApiSpy();
    errorHandler = createErrorHandlerSpy();
    navigatorSpy = createNavigatorSpy();
    TestBed.configureTestingModule({
      providers: [
        { provide: GroupResolver, useClass: GroupResolver },
        { provide: Router, useValue: routerSpy },
        { provide: GroupApi, useValue: groupApiSpy },
        { provide: UserAndGroupErrorHandler, useValue: errorHandler },
        { provide: UserAndGroupNavigator, useValue: navigatorSpy },
      ],
    });
    resolver = TestBed.inject(GroupResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve to null when url ends with new group', () => {
    const routerState: RouterStateSnapshot = { root: undefined, url: `/something${GROUP_PATH}/${GROUP_NEW_PATH}` };
    const resolvedGroup = resolver.resolve(undefined, routerState);

    expect(resolvedGroup).toBeFalsy();
  });

  it('should resolve to group when url has id param and api returns group', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has', 'get']);
    paramMapSpy.has.and.returnValue(true);
    paramMapSpy.get.and.returnValue(GROUP_SELECTOR);
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const expectedGroup = new Group();
    expectedGroup.id = 1;
    groupApiSpy.get.and.returnValue(of(expectedGroup));

    const resolvedGroup$ = resolver.resolve(routeSnapshot, routerState) as Observable<Group>;
    resolvedGroup$.pipe(take(1)).subscribe(
      (group) => {
        expect(group).toEqual(group);
        expect(groupApiSpy.get).toHaveBeenCalledTimes(1);
        done();
      },
      (_) => fail()
    );
  });

  it('should navigate to new group when url has id param and api returns undefined', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has', 'get']);
    paramMapSpy.has.and.returnValue(true);
    paramMapSpy.get.and.returnValue(GROUP_SELECTOR);
    paramMapSpy.has.and.returnValue(true);
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const expectedRoute = 'new group';
    groupApiSpy.get.and.returnValue(of(undefined));
    navigatorSpy.toNewGroup.and.returnValue(expectedRoute);

    const resolvedGroup = resolver.resolve(routeSnapshot, routerState) as Observable<Group>;
    resolvedGroup.pipe(take(1)).subscribe(
      (_) => fail(),
      (_) => fail(),
      () => {
        expect(groupApiSpy.get).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith([expectedRoute]);
        expect(navigatorSpy.toNewGroup).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('should resolve to empty when has id param and api throws error', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has', 'get']);
    paramMapSpy.has.and.returnValue(true);
    paramMapSpy.get.and.returnValue(GROUP_SELECTOR);
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const expectedRoute = 'new group';
    navigatorSpy.toNewGroup.and.returnValue(expectedRoute);
    groupApiSpy.get.and.returnValue(throwError({ status: 400 }));

    const resolvedGroup$ = resolver.resolve(routeSnapshot, routerState) as Observable<Group>;
    resolvedGroup$.pipe(take(1)).subscribe(
      (_) => fail(),
      (_) => fail(),
      () => {
        expect(groupApiSpy.get).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith([expectedRoute]);
        expect(navigatorSpy.toNewGroup).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });

  it('should navigate to new when does not match new group path and has no id param', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has']);
    paramMapSpy.has.and.returnValue(false);
    const routeSnapshot = new ActivatedRouteSnapshot();
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };
    const expectedRoute = 'new group';
    navigatorSpy.toNewGroup.and.returnValue(expectedRoute);

    const resolvedGroup$ = resolver.resolve(routeSnapshot, routerState) as Observable<Group>;
    resolvedGroup$.pipe(take(1)).subscribe(
      (_) => fail(),
      (_) => fail(),
      () => {
        expect(groupApiSpy.get).toHaveBeenCalledTimes(0);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith([expectedRoute]);
        expect(navigatorSpy.toNewGroup).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });
});
