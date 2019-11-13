import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GroupEditFormGroup} from './group-edit-form-group';
import {Group} from '../../../../model/group/group.model';
import {takeWhile} from 'rxjs/operators';
import {GroupChangedEvent} from '../../../../model/events/group-changed-event';
import {BaseComponent} from '../../../../model/base-component';

@Component({
  selector: 'kypo2-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEditComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() group: Group;
  @Output() edited: EventEmitter<GroupChangedEvent> = new EventEmitter();

  tomorrow: Date;
  groupEditFormGroup: GroupEditFormGroup;

  get name() {
    return this.groupEditFormGroup.formGroup.get('name');
  }

  get description() {
    return this.groupEditFormGroup.formGroup.get('description');
  }

  get expirationDate() {
    return this.groupEditFormGroup.formGroup.get('expirationDate');
  }

  ngOnInit(): void {
    const today = new Date();
    this.tomorrow = new Date(new Date(today.setDate(today.getDate() + 1)).setHours(0, 0, 0));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('group' in changes) {
      this.groupEditFormGroup = new GroupEditFormGroup(this.group);
      this.setupOnFormChangedEvent();
    }
  }

  private setupOnFormChangedEvent() {
    this.groupEditFormGroup.formGroup.valueChanges
      .pipe(
        takeWhile(_ => this.isAlive),
      ).subscribe(_ => this.onChanged());
  }


  private onChanged() {
    this.groupEditFormGroup.setValuesToGroup(this.group);
    this.edited.emit(new GroupChangedEvent(
      this.group,
      this.groupEditFormGroup.formGroup.valid)
    );
  }
}
