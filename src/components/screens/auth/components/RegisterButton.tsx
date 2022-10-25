import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Linking} from 'react-native';
import Button from '../../../general/Button';
import Switch from '../../../general/Switch';
import OneWelcomeSdk, {Events, Types} from 'onewelcome-react-native-sdk';
import {CurrentUser} from '../../../../auth/auth';
import IdpSelectorModal from './IdpSelectorModal';

interface Props {
  onRegistered?: () => void;
}

const RegisterButton: React.FC<Props> = props => {
  const [isDefaultProvider, setIsDefaultProvider] = useState(true);
  const [isRegistering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Types.IdentityProvider[]>([]);
  const [isShownCustomRegistration, setShowCustomRegistration] = useState(
    false,
  );

  const handleCustomRegistration = useCallback(
    async (event: Events.CustomRegistrationEvent) => {
      switch (event.identityProviderId) {
        case 'qr_registration':
          OneWelcomeSdk.submitCustomRegistrationAction(
            Events.CustomRegistrationAction.ProvideToken,
            event.identityProviderId,
            'Onegini',
          );
          break;
        default:
          return;
      }
    },
    [],
  );

  const handleRegistrationURLEvent = useCallback(
    async (event: Events.RegistrationURLEvent) => {
      Linking.openURL(event.url);
    },
    [],
  );

  const startRegister = async (
    providerId: string | null,
    onRegisterSuccess?: () => void,
  ) => {
    setError?.(null);
    setRegistering?.(true);

    try {
      const profile = await OneWelcomeSdk.registerUser(providerId, ['read']);
      CurrentUser.id = profile.profileId;
      setRegistering(false);
      onRegisterSuccess?.();
    } catch (e: any) {
      setRegistering(false);
      setShowCustomRegistration(false);
      setError?.(e.message ? e.message : 'Something strange happened');
    }
  };

  useEffect(() => {
    const customRegistrationListener = OneWelcomeSdk.addEventListener(
      Events.SdkNotification.CustomRegistration,
      handleCustomRegistration,
    );

    const registerListener = OneWelcomeSdk.addEventListener(
      Events.SdkNotification.Registration,
      handleRegistrationURLEvent,
    );

    return () => {
      customRegistrationListener.remove();
      registerListener.remove();
    };
  }, [handleCustomRegistration, handleRegistrationURLEvent]);

  useEffect(() => {
    OneWelcomeSdk.getIdentityProviders().then(identityProviders => {
      setProviders(identityProviders);
    });
  }, []);

  const handleSelectedIdp = (id: string) => {
    startRegister(id, props.onRegistered);
  };

  const handleCancelIdpModal = () => {
    setShowCustomRegistration(false);
  };

  return (
    <View style={styles.container}>
      <IdpSelectorModal
        visible={isShownCustomRegistration}
        identityProviders={providers ?? []}
        onSetSelectedIdp={handleSelectedIdp}
        onCancel={handleCancelIdpModal}
      />
      <Button
        name={
          isRegistering
            ? 'CANCEL'
            : isDefaultProvider
            ? 'REGISTER'
            : 'REGISTER WITH...'
        }
        onPress={() =>
          isRegistering
            ? OneWelcomeSdk.cancelRegistration()
            : isDefaultProvider
            ? startRegister(null, props.onRegistered)
            : setShowCustomRegistration(true)
        }
      />
      <Switch
        containerStyle={styles.switch}
        label={'USE DEFAULT IDENTITY PROVIDER'}
        onSwitch={() => setIsDefaultProvider(!isDefaultProvider)}
        value={isDefaultProvider}
      />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  switch: {
    marginTop: 10,
  },
  errorText: {
    marginTop: 10,
    fontSize: 15,
    color: '#c82d2d',
  },
});

export default RegisterButton;
