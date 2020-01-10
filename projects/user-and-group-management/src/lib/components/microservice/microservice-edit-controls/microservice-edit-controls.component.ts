import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Microservice edit controls for microservice edit component
 */
@Component({
  selector: 'kypo2-microservice-edit-controls',
  templateUrl: './microservice-edit-controls.component.html',
  styleUrls: ['./microservice-edit-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicroserviceEditControlsComponent implements OnInit {

  /**
   * True if form is valid, false otherwise
   */
  @Input() isFormValid: boolean;

  /**
   * True if microservice has selected default role, false otherwise
   */
  @Input() hasDefaultRole: boolean;

  /**
   * Event emitter requesting to create new role
   */
  @Output() create = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Emits event to create new role
   */
  onCreate() {
    this.create.emit();
  }
}
