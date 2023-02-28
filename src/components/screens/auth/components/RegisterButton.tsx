import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Linking} from 'react-native';
import Button from '../../../general/Button';
import Switch from '../../../general/Switch';
import OneWelcomeSdk, {Events, Types} from 'onewelcome-react-native-sdk';
import {CurrentUser} from '../../../../auth/auth';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {cancelRegistration} from '../../../helpers/RegistrationHelper';

interface Props {
  onRegistered?: () => void;
}

const RegisterButton: React.FC<Props> = props => {
  const [isDefaultProvider, setIsDefaultProvider] = useState(true);
  const [isRegistering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Types.IdentityProvider[]>([]);

  const {showActionSheetWithOptions} = useActionSheet();

  const showIdentityProvidersSelector = () => {
    const providerNames = providers.map(provider => provider.name);
    const options = providerNames.concat(['Cancel']);
    const cancelButtonIndex = options.length - 1;
    const message = 'Choose an identity provider to register with';
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        message,
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined && selectedIndex < options.length - 1) {
          let provider = providers[selectedIndex];
          if (provider) {
            handleSelectedIdp(provider.id);
          }
        }
      },
    );
  };

  const handleCustomRegistration = useCallback(
    async (event: Events.CustomRegistrationEvent) => {
      switch (event.identityProviderId) {
        case 'qr_registration':
          OneWelcomeSdk.submitCustomRegistrationAction(
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
      const authData = await OneWelcomeSdk.registerUser(providerId, ['read']);
      CurrentUser.id = authData.userProfile.id;
      setRegistering(false);
      onRegisterSuccess?.();
    } catch (e: any) {
      setRegistering(false);
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

  return (
    <View style={styles.container}>
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
            ? cancelRegistration()
            : isDefaultProvider
            ? startRegister(null, props.onRegistered)
            : showIdentityProvidersSelector()
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
