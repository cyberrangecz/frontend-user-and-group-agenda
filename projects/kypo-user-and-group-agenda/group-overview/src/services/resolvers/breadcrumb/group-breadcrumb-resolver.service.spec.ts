import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ParamMap, RouterStateSnapshot } from '@angular/router';
import { Group } from '@cyberrangecz-platform/user-and-group-model';
import { Observable, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { GROUP_EDIT_PATH, GROUP_NEW_PATH } from '../../../../../src/default-paths';
import { GroupResolver } from '../group-resolver.service';
import { GroupBreadcrumbResolver } from './group-breadcrumb-resolver.service';

describe('GroupBreadcrumbResolver', () => {
  let resolver: GroupBreadcrumbResolver;
  let groupResolverSpy: jasmine.SpyObj<GroupResolver>;

  beforeEach(() => {
    groupResolverSpy = jasmine.createSpyObj('GroupResolver', ['resolve']);
    TestBed.configureTestingModule({
      providers: [
        { provide: GroupBreadcrumbResolver, useClass: GroupBreadcrumbResolver },
        { provide: GroupResolver, useValue: groupResolverSpy },
      ],
    });
    resolver = TestBed.inject(GroupBreadcrumbResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve to create breadcrumb when url ends with new group-overview path', () => {
    const routerState: RouterStateSnapshot = { root: undefined, url: `something/${GROUP_NEW_PATH}` };
    const resolvedTitle = resolver.resolve(undefined, routerState);

    expect(resolvedTitle).toEqual(resolver.CREATE_GROUP_BREADCRUMB);
  });

  it('should resolve to group-overview name when has id param and group-overview resolver returns group-overview', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has']);
    paramMapSpy.has.and.returnValue(true);
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const group = new Group();
    group.name = 'Group Test Name';
    groupResolverSpy.resolve.and.returnValue(of(group));

    const resolvedTitle$ = resolver.resolve(routeSnapshot, routerState) as Observable<string>;
    resolvedTitle$.pipe(take(1)).subscribe(
      (title) => {
        expect(title).toEqual(group.name);
        expect(groupResolverSpy.resolve).toHaveBeenCalledTimes(1);
        done();
      },
      () => fail(),
    );
  });

  it('should resolve to state group-overview name when has id param and group-overview resolver returns group-overview', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has']);
    paramMapSpy.has.and.returnValue(true);
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routerState: RouterStateSnapshot = { root: undefined, url: GROUP_EDIT_PATH };
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const group = new Group();
    group.name = 'Group Test Name';
    groupResolverSpy.resolve.and.returnValue(of(group));

    const resolvedTitle$ = resolver.resolve(routeSnapshot, routerState) as Observable<string>;
    resolvedTitle$.pipe(take(1)).subscribe(
      (title) => {
        expect(title).toEqual(`Edit ${group.name}`);
        expect(groupResolverSpy.resolve).toHaveBeenCalledTimes(1);
        done();
      },
      () => fail(),
    );
  });

  it('should resolve to empty when has id param and group-overview resolver returns undefined', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has']);
    paramMapSpy.has.and.returnValue(true);
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    groupResolverSpy.resolve.and.returnValue(of(undefined));

    const resolvedTitle$ = resolver.resolve(routeSnapshot, routerState) as Observable<string>;
    resolvedTitle$.pipe(take(1)).subscribe(
      (title) => {
        expect(groupResolverSpy.resolve).toHaveBeenCalledTimes(1);
        expect(title).toEqual('');
        done();
      },
      () => fail(),
    );
  });

  it('should resolve to empty when has id param and group-overview resolver throws error', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has']);
    paramMapSpy.has.and.returnValue(true);
    const routeSnapshot = new ActivatedRouteSnapshot();
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    groupResolverSpy.resolve.and.returnValue(throwError({ status: 400 }));

    const resolvedTitle$ = resolver.resolve(routeSnapshot, routerState) as Observable<string>;
    resolvedTitle$.pipe(take(1)).subscribe(
      (title) => {
        expect(groupResolverSpy.resolve).toHaveBeenCalledTimes(1);
        expect(title).toEqual('');
        done();
      },
      () => fail(),
    );
  });

  it('should resolve to empty observable when does not match new group-overview path and has no id param', (done) => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has']);
    paramMapSpy.has.and.returnValue(false);
    const routeSnapshot = new ActivatedRouteSnapshot();
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };

    const resolvedTitle$ = resolver.resolve(routeSnapshot, routerState) as Observable<string>;
    resolvedTitle$.pipe(take(1)).subscribe(
      () => fail(),
      () => fail(),
      () => done(),
    );
  });
});
