export interface CustomProvider {
  id: string;
  isTwoStep: boolean;
}

export interface Config {
  enableFingerprint: boolean;
  securityControllerClassName: string;
  enableMobileAuthenticationOtp: boolean;
  configModelClassName: string | null;
  customProviders: [CustomProvider?];
}

export interface IdentityProvider {
  id: string;
  name: string;
}

export interface Profile {
  profileId: string;
}

export interface ImplicitUserDetails {
  decoratedUserId: string;
}

export interface RedirectUri {
  redirectUri: string;
}

export interface AppDetailsResources {
  applicationIdentifier: string;
  applicationPlatform: string;
  applicationVersion: string;
}

export interface Device {
  id: string;
  name: string;
  application: string;
  platform: string;
  isMobileAuthenticationEnabled: boolean;
}

export interface AuthData {
  userProfile: Profile;
  customInfo: string;
}

export interface Authenticator {
  id: string;
  name: string;
  type: string;
  isPreferred: boolean;
  isRegistered: boolean;
  userProfile?: Profile;
}

export interface SingleSignOnData {
  token: string;
  url: string;
}