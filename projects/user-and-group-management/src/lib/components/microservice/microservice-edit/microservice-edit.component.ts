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
import { KypoBaseComponent } from 'kypo-common';
import { takeWhile } from 'rxjs/operators';
import { MicroserviceRolesState } from '../../../model/microservice/microservice-roles-state';
import { Microservice } from '../../../model/microservice/microservice.model';
import { MicroserviceEditFormGroup } from './microservice-edit-form-group';

/**
 * Component for editing main info about microservice and its roles
 */
@Component({
  selector: 'kypo2-microservice-edit',
  templateUrl: './microservice-edit.component.html',
  styleUrls: ['./microservice-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceEditComponent extends KypoBaseComponent implements OnInit, OnChanges {
  /**
   * Edited microservice
   */
  @Input() microservice: Microservice;

  /**
   * Event emitter of microservice change
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
   * @param event event describing state of the microservice roles
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
