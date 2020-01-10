/**
 * Universal filter which can be applied on a paginated resource
 */
export class Filter {

  /**
   * Name of a filtered parameter
   */
  paramName: string;

  /**
   * value by which should be filtered
   */
  value: string;

  constructor(paramName: string, value: string) {
    this.paramName = paramName;
    this.value = value;
  }
}
