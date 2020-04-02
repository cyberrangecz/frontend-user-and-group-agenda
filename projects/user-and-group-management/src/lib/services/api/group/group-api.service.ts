import {KypoFilter, KypoPaginatedResource, KypoRequestedPagination} from 'kypo-common';
import {Observable} from 'rxjs';
import {Group} from '../../../model/group/group.model';
import {UserRole} from 'kypo2-auth';

export abstract class GroupApi {

  /**
   * Sends http request to get paginated groups
   * @param pagination requested pagination
   * @param filter filter to be applied on groups
   */
  abstract getAll(pagination: KypoRequestedPagination, filter?: KypoFilter[]): Observable<KypoPaginatedResource<Group>>;

  /**
   * Sends http request to get group by id
   * @param groupId id of requested group
   */
  abstract get(groupId: number): Observable<Group>;

  /**
   * Sends http request to create new group
   * @param group group to create
   * @param groupsToImportFromId ids of groups to import users from
   */
  abstract create(group: Group, groupsToImportFromId?: number[]): Observable<number>;

  /**
   * Sends http request to update existing group
   * @param group group to update
   */
  abstract update(group: Group): Observable<any>;

  /**
   * Sends http request to delete multiple groups
   * @param groupIds ids of groups to delete
   */
  abstract deleteMultiple(groupIds: number[]): Observable<any>;

  /**
   * Sends http request to assign role to group
   * @param groupId id of a group to be associated with a role
   * @param roleId id of a role to be assigned to a group
   */
  abstract assignRole(groupId: number, roleId: number): Observable<any>;

  /**
   * Sends http request to remove role from group
   * @param groupId id of group which associated with a role should be cancelled
   * @param roleId id of a role to be removed from group
   */
  abstract removeRole(groupId: number, roleId: number): Observable<any>;

  /**
   * Sends http request to get all roles of a group
   * @param groupId id of a group associated with roles
   * @param pagination requested pagination
   * @param filter filter to be applied on result
   */
  abstract getRolesOfGroup(groupId: number, pagination: KypoRequestedPagination, filter?: KypoFilter[]): Observable<KypoPaginatedResource<UserRole>>;

  /**
   * Sends http request to remove users from a group
   * @param groupId id of a group associated with users
   * @param userIds ids of users to be removed from a group
   */
  abstract removeUsersFromGroup(groupId: number, userIds: number[]): Observable<any>;

  /**
   * Sends http request to add users to a group
   * @param groupId id of a group to be associated with users
   * @param userIds ids of users to be added to the group
   * @param groupIds ids of a groups from where users should be imported
   */
  abstract addUsersToGroup(groupId: number, userIds: number[], groupIds?: number[]): Observable<any>;
}
