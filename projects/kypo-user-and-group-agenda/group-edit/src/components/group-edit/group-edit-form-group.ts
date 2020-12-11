import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Group } from '@muni-kypo-crp/user-and-group-model';

/**
 * Form control class for state group-overview componnet
 */
export class GroupEditFormGroup {
  formGroup: FormGroup;

  constructor(group: Group) {
    this.formGroup = new FormGroup({
      name: new FormControl(group.name, Validators.required),
      description: new FormControl(group.description, Validators.required),
      expirationDate: new FormControl(group.expirationDate, Validators.min(this.calculateTomorrowTimestamp())),
    });
  }

  /**
   * Sets values inserted to form inputs to group-overview object
   * @param group group-overview to be filled with form data
   */
  setValuesToGroup(group: Group): void {
    group.name = this.formGroup.get('name').value;
    group.description = this.formGroup.get('description').value;
    group.expirationDate = this.formGroup.get('expirationDate').value;
  }

  private calculateTomorrowTimestamp() {
    const today = new Date();
    return new Date(new Date(today.setDate(today.getDate() + 1)).setHours(0, 0, 0)).valueOf();
  }
}
