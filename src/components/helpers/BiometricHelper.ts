import OneWelcomeSdk, {Types} from 'onewelcome-react-native-sdk';

const isBiometricAuthenticatorRegistered = async (): Promise<boolean> => {
  const profile = await OneWelcomeSdk.getAuthenticatedUserProfile();
  const registeredAuthenticators =
    await OneWelcomeSdk.getRegisteredAuthenticators(profile.id);
  const registered = registeredAuthenticators.some(
    authenticator =>
      authenticator.isRegistered &&
      Object.values<string>(Types.BiometricAuthenticatorIds).includes(
        authenticator.id,
      ),
  );

  return registered;
};

export {isBiometricAuthenticatorRegistered};
