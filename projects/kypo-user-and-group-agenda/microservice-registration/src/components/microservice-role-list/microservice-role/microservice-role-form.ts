import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MicroserviceRole } from '@muni-kypo-crp/user-and-group-model';

/**
 * Form control of microservice-registration state form
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
   * Sets values inserted to form to microservice-registration role object
   * @param role role to be filled from inserted form values
   */
  setValuesToRole(role: MicroserviceRole) {
    role.description = this.formGroup.get('description').value;
    role.default = this.formGroup.get('default').value;
    role.type = this.formGroup.get('type').value;
  }
}
