import { UserManager, WebStorageStateStore } from "oidc-client-ts";

// https://github.com/authts/sample-keycloak-react-oidc-context/blob/main/react/src/config.ts
export const userManager = new UserManager({
  // basic OIDC settings
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: `${window.location.origin}${window.location.pathname}`,

  // required for automatic sign-in
  userStore: new WebStorageStateStore({ store: window.localStorage }),

  // cross-tab login/logout detection
  monitorSession: true,
});

export const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};
