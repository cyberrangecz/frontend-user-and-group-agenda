import { FormGroup, FormControl, Validators } from '@angular/forms';

export class GroupEditFormGroup {

  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      'name': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required)
    });
  }
}
