import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'kypo2-microservice-controls',
  templateUrl: './microservice-controls.component.html',
  styleUrls: ['./microservice-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceControlsComponent implements OnInit {

  @Input() isFormValid: boolean;
  @Input() hasDefaultRole: boolean;
  @Output() create = new EventEmitter();
  @Output() reset = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onCreate() {
    this.create.emit();
  }

  onReset() {
    this.reset.emit();
  }
}
