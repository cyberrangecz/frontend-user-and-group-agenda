import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MicroserviceFormGroup} from './microservice-form-group';
import {Microservice} from '../../../model/microservice/microservice.model';
import {FormArray, FormControl} from '@angular/forms';
import {takeWhile} from 'rxjs/operators';
import {BaseComponent} from '../../../model/base-component';
import {MicroserviceRolesState} from '../../../model/microservice/microservice-roles-state';
import {MicroserviceState} from '../../../model/microservice/microservice-state';
import {Observable} from 'rxjs';

@Component({
  selector: 'kypo2-microservice-create',
  templateUrl: './microservice-create.component.html',
  styleUrls: ['./microservice-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceCreateComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() microservice: Microservice;
  @Input() isCleared: Observable<boolean>;
  @Output() formValid: EventEmitter<MicroserviceState> = new EventEmitter<MicroserviceState>();
  formValidity: boolean;
  microserviceFormGroup: MicroserviceFormGroup;

  constructor() {
    super();
  }

  get name() {
    return this.microserviceFormGroup.formGroup.get('name');
  }

  get endpoint() {
    return this.microserviceFormGroup.formGroup.get('endpoint');
  }

  get roles() {
    return <FormArray>this.microserviceFormGroup.formGroup.get('roles');
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('microservice' in changes) {
      this.microserviceFormGroup = new MicroserviceFormGroup(this.microservice);
      this.setupOnFormChangedEvent();
    }
  }

  rolesChange(event: MicroserviceRolesState) {
    this.formValidity = (this.microserviceFormGroup.formGroup.valid && event.validity);
    if (event.isAdded) {
      (this.roles as FormArray).push(new FormControl(''));
    } else if (event.isRemoved) {
      this.roles.removeAt(event.roleIndex);
    } else {
      this.roles.at(event.roleIndex).setValue(event.roles[event.roleIndex]);
    }
    this.formValid.emit({
      roles: this.roles.value,
      name: this.name.value,
      endpoint: this.endpoint.value,
      valid: this.formValidity
    });
  }

  onClear() {
    this.microserviceFormGroup.setValuesToMicroservice(this.microservice);
    this.formValid.emit({
      roles: this.roles.value,
      name: this.name.value,
      endpoint: this.endpoint.value,
      valid: false
    });
  }

  private setupOnFormChangedEvent() {
    this.microserviceFormGroup.formGroup.valueChanges
      .pipe(
        takeWhile(_ => this.isAlive),
      ).subscribe(_ => this.onChanged());
  }

  private onChanged() {
    this.microserviceFormGroup.setValuesToMicroservice(this.microservice);
    this.formValid.emit({
      roles: this.roles.value,
      name: this.name.value,
      endpoint: this.endpoint.value,
      valid: this.formValidity
    });
  }

}
