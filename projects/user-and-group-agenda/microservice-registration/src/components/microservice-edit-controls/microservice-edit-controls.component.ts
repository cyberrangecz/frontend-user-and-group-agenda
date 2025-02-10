/* eslint-disable @angular-eslint/no-output-on-prefix */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Microservice state controls for microservice-registration state component
 */
@Component({
  selector: 'crczp-microservice-edit-controls',
  templateUrl: './microservice-edit-controls.component.html',
  styleUrls: ['./microservice-edit-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicroserviceEditControlsComponent {
  /**
   * True if form is valid, false otherwise
   */
  @Input() isFormValid: boolean;

  /**
   * True if microservice-registration has selected default role, false otherwise
   */
  @Input() hasDefaultRole: boolean;

  /**
   * Event emitter requesting to create new role
   */
  @Output() create = new EventEmitter();

  /**
   * Emits event to create new role
   */
  onCreate(): void {
    this.create.emit();
  }
}
