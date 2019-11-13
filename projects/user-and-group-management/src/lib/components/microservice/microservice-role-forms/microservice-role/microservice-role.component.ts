import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MicroserviceRole} from '../../../../model/microservice/microservice-role.model';
import {MicroserviceRoleForm} from './microservice-role-form';
import {takeWhile} from 'rxjs/operators';
import {BaseComponent} from '../../../../model/base-component';
import {MicroserviceRoleItem} from '../../../../model/microservice/microservice-role-item';

@Component({
  selector: 'kypo2-microservice-role',
  templateUrl: './microservice-role.component.html',
  styleUrls: ['./microservice-role.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceRoleComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() role: MicroserviceRole;
  @Output() remove = new EventEmitter();
  @Output() roleChange: EventEmitter<MicroserviceRoleItem> = new EventEmitter();
  microserviceRoleFormGroup: MicroserviceRoleForm;

  constructor() {
    super();
  }

  get description() {
    return this.microserviceRoleFormGroup.formGroup.get('description');
  }

  get type() {
    return this.microserviceRoleFormGroup.formGroup.get('type');
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('role' in changes) {
      this.microserviceRoleFormGroup = new MicroserviceRoleForm(this.role);
      if (changes.role.isFirstChange()) {
        this.description.markAsTouched();
        this.type.markAsTouched();
      }
      this.setupOnFormChangedEvent();
    }
  }

  removeRole() {
    this.remove.emit();
  }

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
