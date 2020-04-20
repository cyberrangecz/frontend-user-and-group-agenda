import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Microservice } from 'kypo-user-and-group-model';

/**
 * Form control for microservice edit component
 */
export class MicroserviceEditFormGroup {
  formGroup: FormGroup;

  constructor(microservice: Microservice) {
    this.formGroup = new FormGroup({
      name: new FormControl(microservice.name, Validators.required),
      endpoint: new FormControl(microservice.endpoint, Validators.required),
      roles: new FormArray(
        microservice.roles.map((roles) => new FormControl(roles)),
        Validators.required
      ),
    });
  }

  /**
   * Sets values inserted to form to microservice object
   * @param microservice microservice to be filled with values
   */
  setValuesToMicroservice(microservice: Microservice) {
    microservice.name = this.formGroup.get('name').value;
    microservice.endpoint = this.formGroup.get('endpoint').value;
    microservice.roles = this.formGroup.get('roles').value;
  }
}
