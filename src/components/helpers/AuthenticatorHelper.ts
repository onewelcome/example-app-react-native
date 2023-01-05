import OneWelcomeSdk, {Types} from 'onewelcome-react-native-sdk';

const getAllAuthenticators = async (
  setRegisteredAuthenticators: (authenticators: Types.Authenticator[]) => void,
  setAllAuthenticators: (authenticators: Types.Authenticator[]) => void,
  setPreferred: (authenticator: Types.Authenticator) => void,
) => {
  const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
  const registeredAuthenticators =
    await OneWelcomeSdk.getRegisteredAuthenticators(profile.profileId);

  const allAuthenticators = await OneWelcomeSdk.getAllAuthenticators(
    profile.profileId,
  );

  registeredAuthenticators.forEach(it => {
    if (it.isPreferred) {
      setPreferred(it);
    }
  });
  setRegisteredAuthenticators(registeredAuthenticators);
  setAllAuthenticators(allAuthenticators);
};

const setPreferredAuthenticator = async (
  preferred: Types.Authenticator,
  setMessage: (msg: string) => void,
) => {
  try {
    const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
    await OneWelcomeSdk.setPreferredAuthenticator(
      profile.profileId,
      preferred.id,
    );
    setMessage('The ' + preferred.name + ' is set');
  } catch (error: any) {
    setMessage(error.message);
  }
};

export {getAllAuthenticators, setPreferredAuthenticator};
