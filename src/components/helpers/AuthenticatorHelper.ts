import OneWelcomeSdk, {Types} from 'onewelcome-react-native-sdk';

const getAllAuthenticators = async (
  setRegisteredAuthenticators: (authenticators: Types.Authenticator[]) => void,
  setAllAuthenticators: (authenticators: Types.Authenticator[]) => void,
  setPreferredAuthenticator: (authenticator: Types.Authenticator) => void,
) => {
  const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
  const registeredAuthenticators =
    await OneWelcomeSdk.getRegisteredAuthenticators(profile.profileId);

  const allAuthenticators = await OneWelcomeSdk.getAllAuthenticators(
    profile.profileId,
  );

  registeredAuthenticators.forEach(it => {
    if (it.isPreferred) {
      setPreferredAuthenticator(it);
    }
  });
  setRegisteredAuthenticators(registeredAuthenticators);
  setAllAuthenticators(allAuthenticators);
};

const setPreferredAuthenticatorSdk = async (
  preferred: Types.Authenticator,
  setMessage: (msg: string) => void,
) => {
  try {
    const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
    await OneWelcomeSdk.setPreferredAuthenticator(
      profile.profileId,
      preferred.id,
    );
    setMessage(
      `The Authenticator ${preferred.name} is now set as the default authentication method`,
    );
  } catch (error: any) {
    setMessage(error.message);
  }
};

export {getAllAuthenticators, setPreferredAuthenticatorSdk};
