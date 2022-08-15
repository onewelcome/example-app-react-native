import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  EmitterSubscription,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [linkUri, setLinkUri] = useState<string | null>(null);
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

  useEffect(() => {
    const listener = OneWelcomeSdk.addEventListener(
      Events.SdkNotification.CustomRegistration,
      handleCustomRegistration,
    );

    return () => {
      listener.remove();
    };
  }, [handleCustomRegistration]);

  useEffect(() => {
    const handleOpenURL = (event: any) => {
      if (event.url.substr(0, event.url.indexOf(':')) === linkUri) {
        OneWelcomeSdk.handleRegistrationCallback(event.url);
      }
    };

    const getLinkUri = async () => {
      let uri = await AsyncStorage.getItem('@redirectUri');
      setLinkUri(uri);
    };
    let listener: EmitterSubscription;
    if (linkUri) {
      listener = Linking.addListener('url', handleOpenURL);
    } else {
      getLinkUri();
    }

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [linkUri]);

  return (
    <View style={styles.container}>
      {isShownCustomRegistration && !isRegistering ? (
        <CustomRegistrationChooserView
          onProviderSelected={idProvider =>
            startRegister(
              idProvider,
              setRegistering,
              setError,
              props.onRegistered,
            )
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
            ? startRegister(null, setRegistering, setError, props.onRegistered)
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

//

const startRegister = async (
  providerId: string | null,
  setRegistering?: (success: boolean) => void,
  setError?: (error: string | null) => void,
  onRegisterSuccess?: () => void,
) => {
  setError?.(null);
  setRegistering?.(true);

  try {
    const profile = await OneWelcomeSdk.registerUser(providerId, ['read']);
    CurrentUser.id = profile.profileId;
    setRegistering?.(false);
    onRegisterSuccess?.();
  } catch (e: any) {
    setRegistering?.(false);
    setError?.(e.message ? e.message : 'Something strange happened');
  }
};

//

export default RegisterButton;
