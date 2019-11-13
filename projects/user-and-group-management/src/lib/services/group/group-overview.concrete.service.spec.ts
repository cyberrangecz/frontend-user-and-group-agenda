import {async, TestBed} from '@angular/core/testing';
import { GroupOverviewConcreteService } from './group-overview.concrete.service';
import {GroupFacadeService} from '../facade/group/group-facade.service';
import {GroupSelectionService} from '../facade/group/group-selection.service';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {throwError} from 'rxjs';
import {skip} from 'rxjs/operators';

describe('GroupOverviewConcreteService', () => {
  let GroupFacadeServiceSpy = jasmine.createSpyObj('GroupFacadeService', ['getGroups', 'deleteGroups', 'deleteGroup']);
  let GroupSelectionServiceSpy = jasmine.createSpyObj('GroupSelectionService', ['emitDataChange']);
  let Kypo2UserAndGroupNotificationServiceSpy = jasmine.createSpyObj('Kypo2UserAndGroupNotificationService', ['notify']);
  let Kypo2UserAndGroupErrorServiceSpy = jasmine.createSpyObj('Kypo2UserAndGroupErrorService', ['emit']);
  let service: GroupOverviewConcreteService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupOverviewConcreteService,
        {provide: GroupFacadeService, useValue: GroupFacadeServiceSpy},
        {provide: GroupSelectionService, useValue: GroupSelectionServiceSpy},
        {provide: Kypo2UserAndGroupErrorService, useValue: Kypo2UserAndGroupErrorServiceSpy},
        {provide: Kypo2UserAndGroupNotificationService, useValue: Kypo2UserAndGroupNotificationServiceSpy}
      ],
    });
    service = TestBed.get(GroupOverviewConcreteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call error handler on err', done => {
    GroupFacadeServiceSpy.getGroups.and.returnValue(throwError(null));

    service.getAll().subscribe( _ => fail,
      _ => {
        expect(Kypo2UserAndGroupErrorServiceSpy.emit).toHaveBeenCalledTimes(1);
        done();
      });
    expect(GroupFacadeServiceSpy.getGroups).toHaveBeenCalledTimes(1);
  });

  it('should emit hasError observable on err', done => {
    GroupFacadeServiceSpy.getGroups.and.returnValue(throwError(null));

    service.hasError$
      .pipe(
        skip(2) // we ignore initial value and value emitted before the call is made
      ).subscribe( hasError => {
        expect(hasError).toBeTruthy();
        done();
      },
      _ => fail);
    service.getAll().subscribe(
      _ => fail,
      _ => done()
    );
  });

  // it('should emit change on delete', done => {
  //   GroupFacadeServiceSpy.deleteGroup.and.returnValue([]);
  //
  //   service.getAll().subscribe( _ => {
  //     expect(GroupSelectionServiceSpy.emitDataChange).toHaveBeenCalledTimes(1);
  //       done();
  //       },
  //     _ => {
  //       expect(Kypo2UserAndGroupErrorServiceSpy.emit).toHaveBeenCalledTimes(1);
  //     });
  //   expect(GroupFacadeServiceSpy.deleteGroup).toHaveBeenCalledTimes(1);
  // });
});
