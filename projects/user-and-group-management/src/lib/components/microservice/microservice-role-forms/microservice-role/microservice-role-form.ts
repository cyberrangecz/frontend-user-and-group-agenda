import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MicroserviceRole} from '../../../../model/microservice/microservice-role.model';

export class MicroserviceRoleForm {
  formGroup: FormGroup;

  constructor(role: MicroserviceRole) {
    this.formGroup = new FormGroup({
      description: new FormControl(role.description),
      default: new FormControl(role.default),
      type: new FormControl(role.type, Validators.required),
    });
  }

  setValuesToRole(role: MicroserviceRole) {
    role.description = this.formGroup.get('description').value;
    role.default = this.formGroup.get('default').value;
    role.type = this.formGroup.get('type').value;
  }
}
