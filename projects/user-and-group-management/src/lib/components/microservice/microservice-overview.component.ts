import { Component, OnInit } from '@angular/core';
import {Microservice} from '../../model/microservice/microservice.model';
import {MicroserviceState} from '../../model/microservice/microservice-state';
import {MicroserviceRole} from '../../model/microservice/microservice-role.model';
import {MicroserviceFacadeService} from '../../services/facade/microservice/microservice-facade.service';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Kypo2UserAndGroupErrorService} from '../../services/notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/alert-type.enum';
import {Kypo2UserAndGroupNotificationService} from '../../services/notification/kypo2-user-and-group-notification.service';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'kypo2-microservice-overview',
  templateUrl: './microservice-overview.component.html',
  styleUrls: ['./microservice-overview.component.css']
})
export class MicroserviceOverviewComponent implements OnInit {

  microservice: Microservice;
  hasDefaultRole: boolean;
  formValid: boolean;

  private clearSubject$: Subject<boolean> = new Subject<boolean>();
  clear$: Observable<boolean> = this.clearSubject$.asObservable();

  constructor(private microserviceFacadeService: MicroserviceFacadeService,
              private errorHandler: Kypo2UserAndGroupErrorService,
              private alertService: Kypo2UserAndGroupNotificationService) { }

  ngOnInit() {
    this.initMicroservice();
  }

  updateMicroservice(event: MicroserviceState) {
    if (event.valid) {
      this.microservice.name = event.name;
      this.microservice.endpoint = event.endpoint;
      this.microservice.roles = event.roles;
    }
    this.hasDefaultRole = this.miscroserviceHasDefaultRole(event.roles);
    this.formValid = this.hasDefaultRole && event.valid;
    this.clearSubject$.next(false);
  }

  createMiscroservice() {
    this.microserviceFacadeService.createMicroservice(this.microservice)
      .subscribe(
        resp => {
          this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS,
            'Microservice were successfully added'));
          this.clearContent();
          },
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Creating microservice'))
      );
  }

  clearContent() {
    this.clearSubject$.next(true);
    this.initMicroservice();
  }

  private miscroserviceHasDefaultRole(roles: MicroserviceRole[]): boolean {
    for (let i = 0 ; i < roles.length; i++) {
      if (roles[i].default) {
        return roles[i].default;
      }
    }
    return false;
  }

  private initMicroservice() {
    this.microservice = {
      name: '',
      endpoint: '',
      roles: []
    };
  }

}
