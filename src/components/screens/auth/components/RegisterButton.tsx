import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Linking} from 'react-native';
import Button from '../../../general/Button';
import Switch from '../../../general/Switch';
import OneWelcomeSdk, {Events} from 'onewelcome-react-native-sdk';
import CustomRegistrationChooserView from '../CustomRegistrationChooserView';
import {CurrentUser} from '../../../../auth/auth';

//

interface Props {
  onRegistered?: () => void;
}

//@todo add providers selector
const RegisterButton: React.FC<Props> = props => {
  const [isDefaultProvider, setIsDefaultProvider] = useState(true);
  const [isRegistering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <View style={styles.container}>
      {isShownCustomRegistration && !isRegistering ? (
        <CustomRegistrationChooserView
          onProviderSelected={idProvider =>
            startRegister(idProvider, props.onRegistered)
          }
          onCancelPressed={() => setShowCustomRegistration(false)}
        />
      ) : (
        <View />
      )}
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
            : setShowCustomRegistration(!isShownCustomRegistration)
        }
      />
      <Switch
        containerStyle={styles.switch}
        label={'USE DEFAULT IDENTITY PROVIDER'}
        onSwitch={() =>
          setIsDefaultProvider(previousState => {
            if (!previousState) {
              setShowCustomRegistration(false);
            }
            return !previousState;
          })
        }
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
