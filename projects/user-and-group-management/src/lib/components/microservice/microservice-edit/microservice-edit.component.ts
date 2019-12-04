import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MicroserviceEditFormGroup} from './microservice-edit-form-group';
import {Microservice} from '../../../model/microservice/microservice.model';
import {FormArray, FormControl} from '@angular/forms';
import {takeWhile, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../model/base-component';
import {MicroserviceRolesState} from '../../../model/microservice/microservice-roles-state';

@Component({
  selector: 'kypo2-microservice-edit',
  templateUrl: './microservice-edit.component.html',
  styleUrls: ['./microservice-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceEditComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() microservice: Microservice;
  @Output() microserviceChange: EventEmitter<Microservice> = new EventEmitter<Microservice>();

  microserviceFormGroup: MicroserviceEditFormGroup;
  private rolesValidity: boolean;

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
      this.microserviceFormGroup = new MicroserviceEditFormGroup(this.microservice);
      this.setupOnFormChangedEvent();
    }
  }

  onRolesChanged(event: MicroserviceRolesState) {
    if (event.isAdded) {
      (this.roles as FormArray).push(new FormControl(''));
    } else if (event.isRemoved) {
      this.roles.removeAt(event.roleIndex);
    } else {
      this.roles.at(event.roleIndex).setValue(event.roles[event.roleIndex]);
    }
    this.rolesValidity = event.validity;
    this.onChanged();
  }

  private setupOnFormChangedEvent() {
    this.microserviceFormGroup.formGroup.valueChanges
      .pipe(
        takeWhile(_ => this.isAlive)
      ).subscribe(_ => this.onChanged());
  }

  private onChanged() {
    this.microserviceFormGroup.setValuesToMicroservice(this.microservice);
    this.microservice.valid = this.microserviceFormGroup.formGroup.valid && this.rolesValidity;
    this.microserviceChange.emit(this.microservice);
  }

}
