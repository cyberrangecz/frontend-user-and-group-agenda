import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MicroserviceRole } from '../../../../model/microservice/microservice-role.model';

/**
 * Form control of microservice edit form
 */
export class MicroserviceRoleForm {
  formGroup: FormGroup;

  constructor(role: MicroserviceRole) {
    this.formGroup = new FormGroup({
      description: new FormControl(role.description),
      default: new FormControl(role.default),
      type: new FormControl(role.type, Validators.required),
    });
  }

  /**
   * Sets values inserted to form to microservice role object
   * @param role role to be filled from inserted form values
   */
  setValuesToRole(role: MicroserviceRole) {
    role.description = this.formGroup.get('description').value;
    role.default = this.formGroup.get('default').value;
    role.type = this.formGroup.get('type').value;
  }
}
