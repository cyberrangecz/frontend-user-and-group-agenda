// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userAndGroupRestBasePath: 'http://localhost:8084/kypo2-rest-user-and-group/api/v1/',
  rolesPathExtension: 'roles/',
  usersPathExtension: 'users/',
  groupsPathExtension: 'groups/',
  defaultPaginationSize: 5,

  // OIDC SETTINGS
  // Url of the Identity Provider
  issuer: 'https://oidc.ics.muni.cz/oidc/',
  // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/index.html',
  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: '3693320b-6acb-442c-be51-86e18f574f9d',
  // set the scope for the permissions the client should request
  scope: 'openid profile email',
  sessionChecksEnabled: false,
};

