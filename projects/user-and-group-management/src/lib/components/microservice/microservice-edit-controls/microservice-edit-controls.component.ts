import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'kypo2-microservice-edit-controls',
  templateUrl: './microservice-edit-controls.component.html',
  styleUrls: ['./microservice-edit-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceEditControlsComponent implements OnInit {

  @Input() isFormValid: boolean;
  @Input() hasDefaultRole: boolean;
  @Output() create = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onCreate() {
    this.create.emit();
  }
}
