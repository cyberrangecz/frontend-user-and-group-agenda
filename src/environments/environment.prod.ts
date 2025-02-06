// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration production` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const BASE_URL = 'https://172.19.0.22';
const HOME_URL = 'https://localhost:4200';
export const environment = {
    production: true,
    userAndGroupRestBasePath: BASE_URL + '/kypo-rest-user-and-group/api/v1/',
    defaultPaginationSize: 10,
    authConfig: {
        guardMainPageRedirect: 'home', // Redirect from login page if user is logged in
        guardLoginPageRedirect: 'login', // Redirect to login page if user is not logged in
        interceptorAllowedUrls: [BASE_URL],
        authorizationStrategyConfig: {
            authorizationUrl: BASE_URL + '/kypo-rest-user-and-group/api/v1/users/info',
        },
        providers: [
            {
                label: 'Login with MUNI',
                textColor: 'white',
                backgroundColor: '#002776',
                oidcConfig: {
                    requireHttps: true,
                    issuer: BASE_URL + '/keycloak/realms/KYPO',
                    clientId: 'KYPO-client',
                    redirectUri: HOME_URL,
                    scope: 'openid email profile offline_access',
                    logoutUrl: BASE_URL + '/keycloak/realms/KYPO/protocol/openid-connect/logout',
                    silentRefreshRedirectUri: BASE_URL + '/silent-refresh.html',
                    postLogoutRedirectUri: HOME_URL + '/logout-confirmed',
                    clearHashAfterLogin: true,
                },
            },
        ],
    },
};
