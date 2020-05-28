// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userAndGroupRestBasePath: 'https://172.19.0.22/kypo2-rest-user-and-group/api/v1/',
  defaultPaginationSize: 10,
  kypo2AuthConfig: {
    maxRetryAttempts: 3,
    guardMainPageRedirect: 'home',
    guardLoginPageRedirect: 'login',
    tokenInterceptorAllowedUrls: ['https://172.19.0.22'],
    userInfoRestUri: 'https://172.19.0.22/kypo2-rest-user-and-group/api/v1/',
    providers: [
      {
        label: 'Login with local issuer',
        textColor: 'white',
        backgroundColor: '#002776',
        tokenRefreshTime: 30000,
        oidcConfig: {
          issuer: 'https://172.19.0.22:443/csirtmu-dummy-issuer-server/',
          clientId: '0bf33f00-2700-4efb-ab09-186076f85c7d',
          redirectUri: 'https://localhost:4200',
          scope: 'openid email profile',
          logoutUrl: 'https://172.19.0.22/csirtmu-dummy-issuer-server/endsession',
          postLogoutRedirectUri: 'https://localhost:4200',
          silentRefreshRedirectUri: 'https://localhost:4200/silent-refresh.html',
          clearHashAfterLogin: true,
        },
      },
    ],
  },
};
