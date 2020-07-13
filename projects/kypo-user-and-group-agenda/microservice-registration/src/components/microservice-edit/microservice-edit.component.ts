import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { SentinelBaseDirective } from '@sentinel/common';
import { Microservice } from 'kypo-user-and-group-model';
import { takeWhile } from 'rxjs/operators';
import { MicroserviceRolesState } from '../../model/microservice-roles-state';
import { MicroserviceEditFormGroup } from './microservice-edit-form-group';

/**
 * Component for editing main info about microservice-registration and its roles
 */
@Component({
  selector: 'kypo-microservice-edit',
  templateUrl: './microservice-edit.component.html',
  styleUrls: ['./microservice-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceEditComponent extends SentinelBaseDirective implements OnInit, OnChanges {
  /**
   * Edited microservice-registration
   */
  @Input() microservice: Microservice;

  /**
   * Event emitter of microservice-registration change
   */
  @Output() microserviceChange: EventEmitter<Microservice> = new EventEmitter<Microservice>();

  microserviceFormGroup: MicroserviceEditFormGroup;
  private rolesValidity: boolean;

  get name() {
    return this.microserviceFormGroup.formGroup.get('name');
  }

  get endpoint() {
    return this.microserviceFormGroup.formGroup.get('endpoint');
  }

  get roles() {
    return this.microserviceFormGroup.formGroup.get('roles') as FormArray;
  }

  constructor() {
    super();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ('microservice' in changes) {
      this.microserviceFormGroup = new MicroserviceEditFormGroup(this.microservice);
      this.setupOnFormChangedEvent();
    }
  }

  /**
   * Changes internal state of the component when one of the roles is changed
   * @param event event describing state of the microservice-registration roles
   */
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
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe((_) => this.onChanged());
  }

  private onChanged() {
    this.microserviceFormGroup.setValuesToMicroservice(this.microservice);
    this.microservice.valid = this.microserviceFormGroup.formGroup.valid && this.rolesValidity;
    this.microserviceChange.emit(this.microservice);
  }
}
