/**
 * Creates routes to navigate between components and pages of user and group agenda. Default implementation is provived,
 * but can be overridden by client if custom routes are desired
 */
export abstract class UserAndGroupNavigator {
  /**
   * Returns route to user overview page
   */
  abstract toUserOverview(): string;

  /**
   * Return route to group overview page
   */
  abstract toGroupOverview(): string;

  /**
   * Returns route to group edit page
   * @param id id of the group
   */
  abstract toGroupEdit(id: number | string): string;

  /**
   * Returns route to new group page
   */
  abstract toNewGroup(): string;

  /**
   * Returns route to new microservice page
   */
  abstract toNewMicroservice(): string;
}
