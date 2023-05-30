import OneWelcomeSdk, {Types} from '@onewelcome/react-native-sdk';

const getAllAuthenticators = async (
  setRegisteredAuthenticators: (authenticators: Types.Authenticator[]) => void,
  setAllAuthenticators: (authenticators: Types.Authenticator[]) => void,
  setPreferredAuthenticator: (authenticator: Types.Authenticator) => void,
) => {
  const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
  const registeredAuthenticators =
    await OneWelcomeSdk.getRegisteredAuthenticators(profile.id);

  const allAuthenticators = await OneWelcomeSdk.getAllAuthenticators(
    profile.id,
  );

  const prefferedAuthenticator = registeredAuthenticators.find(
    it => it.isPreferred,
  );

  if (prefferedAuthenticator) {
    setPreferredAuthenticator(prefferedAuthenticator);
  }
  setRegisteredAuthenticators(registeredAuthenticators);
  setAllAuthenticators(allAuthenticators);
};

const setPreferredAuthenticatorSdk = async (
  preferred: Types.Authenticator,
  setMessage: (msg: string) => void,
) => {
  try {
    await OneWelcomeSdk.setPreferredAuthenticator(preferred.id);
    setMessage(
      `The Authenticator ${preferred.name} is now set as the default authentication method`,
    );
  } catch (error: any) {
    setMessage(error.message);
  }
};

export {getAllAuthenticators, setPreferredAuthenticatorSdk};
