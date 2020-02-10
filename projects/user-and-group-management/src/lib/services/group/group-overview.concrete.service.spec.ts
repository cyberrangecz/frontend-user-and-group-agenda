import {async, TestBed} from '@angular/core/testing';
import { GroupOverviewConcreteService } from './group-overview.concrete.service';
import {GroupApi} from '../api/group/group-api.service';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {throwError} from 'rxjs';
import {skip} from 'rxjs/operators';
import {RequestedPagination} from '../../model/other/requested-pagination';

describe('GroupOverviewConcreteService', () => {
  const GroupApiSpy = jasmine.createSpyObj('GroupApi', ['getGroups', 'deleteGroups', 'deleteGroup']);
  const Kypo2UserAndGroupNotificationServiceSpy = jasmine.createSpyObj('Kypo2UserAndGroupNotificationService', ['notify']);
  const Kypo2UserAndGroupErrorServiceSpy = jasmine.createSpyObj('Kypo2UserAndGroupErrorService', ['emit']);
  let service: GroupOverviewConcreteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupOverviewConcreteService,
        {provide: GroupApi, useValue: GroupApiSpy},
        {provide: Kypo2UserAndGroupErrorService, useValue: Kypo2UserAndGroupErrorServiceSpy},
        {provide: Kypo2UserAndGroupNotificationService, useValue: Kypo2UserAndGroupNotificationServiceSpy}
      ],
    });
    service = TestBed.inject(GroupOverviewConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call error handler on err', done => {
    GroupApiSpy.getGroups.and.returnValue(throwError(null));

    service.getAll(createMockPagination()).subscribe( _ => fail,
      _ => {
        expect(Kypo2UserAndGroupErrorServiceSpy.emit).toHaveBeenCalledTimes(1);
        done();
      });
    expect(GroupApiSpy.getGroups).toHaveBeenCalledTimes(1);
  });

  it('should emit hasError observable on err', done => {
    GroupApiSpy.getGroups.and.returnValue(throwError(null));

    service.hasError$
      .pipe(
        skip(2) // we ignore initial value and value emitted before the call is made
      ).subscribe( hasError => {
        expect(hasError).toBeTruthy();
        done();
      },
      _ => fail);
    service.getAll(createMockPagination()).subscribe(
      _ => fail,
      _ => done()
    );
  });

  function createMockPagination(): RequestedPagination {
    return new RequestedPagination(0, 0, '', '');
  }

});
