import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Microservice} from '../../../model/microservice/microservice.model';

export class MicroserviceFormGroup {
  formGroup: FormGroup;

  constructor(microservice: Microservice) {
    this.formGroup = new FormGroup({
      name: new FormControl(microservice.name, Validators.required),
      endpoint: new FormControl(microservice.endpoint, Validators.required),
      roles: new FormArray(microservice.roles.map(roles => new FormControl(roles)), Validators.required)
    });
  }

  setValuesToMicroservice(microservice: Microservice) {
    microservice.name = this.formGroup.get('name').value;
    microservice.endpoint = this.formGroup.get('endpoint').value;
    microservice.roles = this.formGroup.get('roles').value;
  }
}
