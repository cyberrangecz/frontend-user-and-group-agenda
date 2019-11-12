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
  @Output() clear = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  createMicroservice() {
    this.create.emit();
  }

  clearMicroservice() {
    this.clear.emit();
  }
}
