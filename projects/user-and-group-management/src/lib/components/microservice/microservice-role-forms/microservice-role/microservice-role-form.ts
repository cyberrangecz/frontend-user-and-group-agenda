import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../../../model/microservice/role.model';

export class MicroserviceRoleForm {
  formGroup: FormGroup;

  constructor(role: Role) {
    this.formGroup = new FormGroup({
      description: new FormControl(role.description),
      default: new FormControl(role.default),
      type: new FormControl(role.type, Validators.required),
    });
  }

  setValuesToRole(role: Role) {
    role.description = this.formGroup.get('description').value;
    role.default = this.formGroup.get('default').value;
    role.type = this.formGroup.get('type').value;
  }
}
