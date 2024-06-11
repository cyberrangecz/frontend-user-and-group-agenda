/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @angular-eslint/no-output-native */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { Microservice } from '@muni-kypo-crp/user-and-group-model';
import { MicroserviceRolesState } from '../../model/microservice-roles-state';
import { MicroserviceEditFormGroup } from './microservice-edit-form-group';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Component for editing main info about microservice-registration and its roles
 */
@Component({
  selector: 'kypo-microservice-edit',
  templateUrl: './microservice-edit.component.html',
  styleUrls: ['./microservice-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceEditComponent implements OnChanges {
  /**
   * Edited microservice-registration
   */
  @Input() microservice: Microservice;

  /**
   * Event emitter of microservice-registration change
   */
  @Output() microserviceChange: EventEmitter<Microservice> = new EventEmitter<Microservice>();

  microserviceFormGroup: MicroserviceEditFormGroup;
  destroyRef = inject(DestroyRef);
  private rolesValidity: boolean;

  get name(): AbstractControl {
    return this.microserviceFormGroup.formGroup.get('name');
  }

  get endpoint(): AbstractControl {
    return this.microserviceFormGroup.formGroup.get('endpoint');
  }

  get roles(): UntypedFormArray {
    return this.microserviceFormGroup.formGroup.get('roles') as UntypedFormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('microservice' in changes) {
      this.microserviceFormGroup = new MicroserviceEditFormGroup(this.microservice);
      this.setupOnFormChangedEvent();
    }
  }

  /**
   * Changes internal state of the component when one of the roles is changed
   * @param event event describing state of the microservice-registration roles
   */
  onRolesChanged(event: MicroserviceRolesState): void {
    if (event.isAdded) {
      (this.roles as UntypedFormArray).push(new UntypedFormControl(''));
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onChanged());
  }

  private onChanged() {
    this.microserviceFormGroup.setValuesToMicroservice(this.microservice);
    this.microservice.valid = this.microserviceFormGroup.formGroup.valid && this.rolesValidity;
    this.microserviceChange.emit(this.microservice);
  }
}
