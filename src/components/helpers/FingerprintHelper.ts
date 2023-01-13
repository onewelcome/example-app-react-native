import OneWelcomeSdk, {Types} from 'onewelcome-react-native-sdk';

const registerFingerprintAuthenticator = async (
  onSuccess: () => void,
  onError: (error: any) => void,
) => {
  try {
    const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
    await OneWelcomeSdk.registerFingerprintAuthenticator(profile.id);
    onSuccess();
  } catch (error: any) {
    onError(error);
  }
};

const deregisterFingerprintAuthenticator = async (
  onSuccess: () => void,
  onError: (error: any) => void,
) => {
  try {
    const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
    await OneWelcomeSdk.deregisterFingerprintAuthenticator(profile.id);
    onSuccess();
  } catch (error: any) {
    onError(error);
  }
};

const getRegisteredAuthenticators = async (
  registeredAuthenticators: (authenticators: Types.Authenticator[]) => void,
  setAllAuthenticators: (authenticators: Types.Authenticator[]) => void,
  preferred: (authenticator: Types.Authenticator) => void,
) => {
  const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
  const authenticators = await OneWelcomeSdk.getRegisteredAuthenticators(
    profile.id,
  );

  const allAuthenticators = await OneWelcomeSdk.getAllAuthenticators(
    profile.id,
  );

  console.log('allAuthenticators: ', JSON.stringify(allAuthenticators));
  console.log('authenticators: ', JSON.stringify(authenticators));

  authenticators.forEach(it => {
    if (it.isPreferred) {
      preferred(it);
    }
  });
  registeredAuthenticators(authenticators);
  setAllAuthenticators(allAuthenticators);
};

const isFingerprintAuthenticatorRegistered = async (
  returnEnable: (enabled: boolean) => void,
) => {
  const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
  const registeredAuthenticators =
    await OneWelcomeSdk.getRegisteredAuthenticators(profile.id);
  const registered = registeredAuthenticators.some(
    authenticator =>
      authenticator.id == 'fingerprint' && authenticator.isRegistered,
  );

  returnEnable(registered);
};

const setPreferredAuthenticator = async (
  preferred: Types.Authenticator,
  successful: (success: boolean) => void,
  message: (msg: string) => void,
) => {
  console.log('preferred');
  console.log(preferred);
  try {
    const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
    await OneWelcomeSdk.setPreferredAuthenticator(profile.id, preferred.id);
    successful(true);
    message('The ' + preferred.name + ' is set');
  } catch (error: any) {
    message(error.message);
    successful(false);
  }
};

export {
  registerFingerprintAuthenticator,
  deregisterFingerprintAuthenticator,
  isFingerprintAuthenticatorRegistered,
  getRegisteredAuthenticators,
  setPreferredAuthenticator,
};
