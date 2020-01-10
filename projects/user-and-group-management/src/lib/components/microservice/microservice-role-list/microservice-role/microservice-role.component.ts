import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MicroserviceRole} from '../../../../model/microservice/microservice-role.model';
import {MicroserviceRoleForm} from './microservice-role-form';
import {takeWhile} from 'rxjs/operators';
import {BaseComponent} from '../../../../model/base-component';
import {MicroserviceRoleItem} from '../../../../model/microservice/microservice-role-item';

/**
 * Component of individual microservice role
 */
@Component({
  selector: 'kypo2-microservice-role',
  templateUrl: './microservice-role.component.html',
  styleUrls: ['./microservice-role.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceRoleComponent extends BaseComponent implements OnInit, OnChanges {

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
   * Form control of edit group
   */
  microserviceRoleFormGroup: MicroserviceRoleForm;

  get description() {
    return this.microserviceRoleFormGroup.formGroup.get('description');
  }

  get type() {
    return this.microserviceRoleFormGroup.formGroup.get('type');
  }

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('role' in changes) {
      this.microserviceRoleFormGroup = new MicroserviceRoleForm(this.role);
      this.setupOnFormChangedEvent();
    }
  }

  /**
   * Emits event to delete this role
   */
  deleteRole() {
    this.delete.emit();
  }

  /**
   * Clears values of the form
   */
  onClear() {
    this.microserviceRoleFormGroup.setValuesToRole(this.role);
    this.roleChange.emit({
      role: this.role,
      valid: false
    });
  }

  private setupOnFormChangedEvent() {
    this.microserviceRoleFormGroup.formGroup.valueChanges
      .pipe(
        takeWhile(_ => this.isAlive),
      ).subscribe(_ => this.onChanged());
  }

  private onChanged() {
    this.microserviceRoleFormGroup.setValuesToRole(this.role);
    this.roleChange.emit({
      role: this.role,
      valid: this.microserviceRoleFormGroup.formGroup.valid
    });
  }

}
