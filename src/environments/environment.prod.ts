export const environment = {
  production: true,
  userAndGroupRestBasePath: 'http://localhost:8081/kypo2-rest-user-and-group/api/v1',
  rolesPathExtension: '/roles',
  usersPathExtension: '/users',
  groupsPathExtension: '/groups',
  // OIDC SETTINGS
  // Url of the Identity Provider
  issuer: 'https://oidc.ics.muni.cz/oidc/',
  // URL of the SPA to redirect the user after silent refresh
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/index.html',
  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: '18cd6765-be1a-4de4-a6c0-6adf9b9882d1',
  // set the scope for the permissions the client should request
  scope: 'openid profile email',
  sessionChecksEnabled: false,
};
