import OneWelcomeSdk from 'onewelcome-react-native-sdk';

const isFingerprintAuthenticatorRegistered = async (
  returnEnable: (enabled: boolean) => void,
) => {
  const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
  const registeredAuthenticators =
    await OneWelcomeSdk.getRegisteredAuthenticators(profile.id);
  const registered = registeredAuthenticators.some(
    authenticator =>
      authenticator.isRegistered &&
      (authenticator.name.toUpperCase() === 'TOUCHID' ||
        authenticator.name.toUpperCase() === 'FINGERPRINT'),
  );

  returnEnable(registered);
};

export {isFingerprintAuthenticatorRegistered};
