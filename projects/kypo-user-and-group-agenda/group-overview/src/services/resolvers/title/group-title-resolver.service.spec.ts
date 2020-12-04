import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ParamMap, RouterStateSnapshot } from '@angular/router';
import { Group } from '@muni-kypo-crp/user-and-group-model';
import { Observable, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { GROUP_NEW_PATH, GROUP_PATH } from '../../../../../src/default-paths';
import { GroupResolver } from '../group-resolver.service';
import { GroupTitleResolver } from './group-title-resolver.service';

describe('GroupTitleResolver', () => {
  let resolver: GroupTitleResolver;
  let groupResolverSpy: jasmine.SpyObj<GroupResolver>;

  beforeEach(() => {
    groupResolverSpy = jasmine.createSpyObj('GroupResolver', ['resolve']);
    TestBed.configureTestingModule({
      providers: [
        { provide: GroupTitleResolver, useClass: GroupTitleResolver },
        { provide: GroupResolver, useValue: groupResolverSpy },
      ],
    });
    resolver = TestBed.inject(GroupTitleResolver);
  });

  it('should create', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve to create group-overview title when url endwith new group-overview path', () => {
    const routerState: RouterStateSnapshot = { root: undefined, url: `something/${GROUP_PATH}/${GROUP_NEW_PATH}` };
    const resolvedTitle = resolver.resolve(undefined, routerState);

    expect(resolvedTitle).toEqual(resolver.CREATE_GROUP_TITLE);
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
        expect(title).toEqual(`Edit ${group.name}`);
        expect(groupResolverSpy.resolve).toHaveBeenCalledTimes(1);
        done();
      },
      (_) => fail()
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
      (_) => fail()
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
      (_) => fail()
    );
  });

  it('should resolve to empty when does not match new group-overview path and has no id param', () => {
    const paramMapSpy: jasmine.SpyObj<ParamMap> = jasmine.createSpyObj('ParamMap', ['has']);
    paramMapSpy.has.and.returnValue(false);
    const routeSnapshot = new ActivatedRouteSnapshot();
    spyOnProperty(routeSnapshot, 'paramMap', 'get').and.returnValue(paramMapSpy);
    const routerState: RouterStateSnapshot = { root: undefined, url: `something` };

    const resolvedTitle = resolver.resolve(routeSnapshot, routerState);
    expect(resolvedTitle).toEqual('');
  });
});
