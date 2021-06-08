/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SentinelBaseDirective } from '@sentinel/common';
import { MicroserviceRole } from '@muni-kypo-crp/user-and-group-model';
import { takeWhile } from 'rxjs/operators';
import { MicroserviceRoleItem } from '../../../model/microservice-role-item';
import { MicroserviceRoleForm } from './microservice-role-form';
import { AbstractControl } from '@angular/forms';

/**
 * Component of individual microservice-registration role
 */
@Component({
  selector: 'kypo-microservice-role',
  templateUrl: './microservice-role.component.html',
  styleUrls: ['./microservice-role.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceRoleComponent extends SentinelBaseDirective implements OnChanges {
  /**
   * Edited role
   */
  @Input() role: MicroserviceRole;

  /**
   * Emits event to delete this role
   */
  @Output() delete = new EventEmitter();

  /**
   * Emits event on role change
   */
  @Output() roleChange: EventEmitter<MicroserviceRoleItem> = new EventEmitter();

  /**
   * Form control of state group-overview
   */
  microserviceRoleFormGroup: MicroserviceRoleForm;

  get description(): AbstractControl {
    return this.microserviceRoleFormGroup.formGroup.get('description');
  }

  get type(): AbstractControl {
    return this.microserviceRoleFormGroup.formGroup.get('type');
  }

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('role' in changes) {
      this.microserviceRoleFormGroup = new MicroserviceRoleForm(this.role);
      this.setupOnFormChangedEvent();
    }
  }

  /**
   * Emits event to delete this role
   */
  deleteRole(): void {
    this.delete.emit();
  }

  /**
   * Clears values of the form
   */
  onClear(): void {
    this.microserviceRoleFormGroup.setValuesToRole(this.role);
    this.roleChange.emit({
      role: this.role,
      valid: false,
    });
  }

  private setupOnFormChangedEvent() {
    this.microserviceRoleFormGroup.formGroup.valueChanges
      .pipe(takeWhile(() => this.isAlive))
      .subscribe(() => this.onChanged());
  }

  private onChanged() {
    this.microserviceRoleFormGroup.setValuesToRole(this.role);
    this.roleChange.emit({
      role: this.role,
      valid: this.microserviceRoleFormGroup.formGroup.valid,
    });
  }
}
