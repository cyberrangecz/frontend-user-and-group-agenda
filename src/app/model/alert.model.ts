import {AlertType} from './enums/alert-type.enum';

export class Alert {
  type: AlertType;
  message: string;

  constructor(type: AlertType, message: string) {
    this.type = type;
    this.message = message;
  }
}
