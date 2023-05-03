import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentContainer from './ContentContainer';
import Row from '../../../general/Row';
import Switch from '../../../general/Switch';
import {
  getAllAuthenticators,
  setPreferredAuthenticatorSdk,
} from '../../../helpers/AuthenticatorHelper';
import {isBiometricAuthenticatorRegistered} from '../../../helpers/BiometricHelper';

import {useActionSheet} from '@expo/react-native-action-sheet';
import OneWelcomeSdk, {Types} from 'onewelcome-react-native-sdk';
import AppColors from '../../../constants/AppColors';
import {Button} from 'react-native-paper';
import {useErrorHandling} from '../../../../helpers/useErrorHandling';

const emptyRegisteredAuthenticators: Types.Authenticator[] = [
  {id: '0', name: '', isPreferred: true, isRegistered: false, type: ''},
];

const pinRegisteredAuthenticator: Types.Authenticator = {
  id: '0',
  name: 'PIN',
  isPreferred: true,
  isRegistered: false,
  type: '',
};

const ChangeAuthView: React.FC = () => {
  const [isBiometricEnable, setBiometricEnable] = useState(false);
  const [message, setMessage] = useState('');
  const [registeredAuthenticators, setRegisteredAuthenticators] = useState<
    Types.Authenticator[]
  >(emptyRegisteredAuthenticators);
  const [allAuthenticators, setAllAuthenticators] = useState<
    Types.Authenticator[]
  >(emptyRegisteredAuthenticators);
  const [preferredAuthenticator, setPreferredAuthenticator] =
    useState<Types.Authenticator>(pinRegisteredAuthenticator);
  const {showActionSheetWithOptions} = useActionSheet();
  const {logoutOnInvalidToken} = useErrorHandling();
  const updateAuthenticators = async () => {
    try {
      setBiometricEnable(await isBiometricAuthenticatorRegistered());
      await getAllAuthenticators(
        setRegisteredAuthenticators,
        setAllAuthenticators,
        setPreferredAuthenticator,
      );
    } catch (error) {
      logoutOnInvalidToken(error);
    }
  };

  useEffect(() => {
    updateAuthenticators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPreferredAuthenticatorSelector = async () => {
    const authenticatorNames = registeredAuthenticators.map(
      authenticator => authenticator.name,
    );
    const options = authenticatorNames.concat(['Cancel']);
    const cancelButtonIndex = options.length - 1;
    const selectorMesssage = 'Choose a preferred authenticator.';
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        message: selectorMesssage,
      },
      async (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined && selectedIndex < options.length - 1) {
          const authenticator = registeredAuthenticators[selectedIndex];
          if (authenticator) {
            try {
              await setPreferredAuthenticatorSdk(authenticator, setMessage);
            } catch (err: any) {
              logoutOnInvalidToken(err);
              setMessage(err.message);
            }
            await updateAuthenticators();
          }
        }
      },
    );
  };

  const biometricAuthenticatorId = allAuthenticators.find(auth =>
    Object.values<string>(Types.BiometricAuthenticatorIds).includes(auth.id),
  )?.id;

  const renderMessage = (msg: string) => {
    if (msg !== '') {
      return <Text style={styles.message}>{msg}</Text>;
    } else {
      return;
    }
  };

  const onSwitchBiometric = async (
    enabled: boolean,
    authenticatorId: string,
  ) => {
    try {
      if (enabled) {
        await OneWelcomeSdk.registerAuthenticator(authenticatorId);
      } else {
        await OneWelcomeSdk.deregisterAuthenticator(authenticatorId);
      }
    } catch (err) {
      logoutOnInvalidToken(err);
    }
    await updateAuthenticators();
  };

  return (
    <ContentContainer containerStyle={styles.container}>
      {renderMessage(message)}
      <Row containerStyle={styles.row}>
        <Text style={styles.methodLabel}>Login Method:</Text>
        <Button
          children={preferredAuthenticator.name}
          disabled={
            !registeredAuthenticators || registeredAuthenticators.length < 1
          }
          style={styles.authSelectorButton}
          textColor={AppColors.textDefault}
          onPress={() => {
            showPreferredAuthenticatorSelector();
          }}
        />
      </Row>
      <View style={styles.authenticatorsHolder}>
        <Text style={styles.authenticatorsLabel}>Authenticators:</Text>
        <Switch
          containerStyle={styles.pinSwitchContainer}
          labelStyle={styles.switchLabel}
          label={'PIN'}
          value={true}
          disabled={true}
        />
        {biometricAuthenticatorId !== undefined && (
          <Switch
            containerStyle={styles.biometricSwitchContainer}
            labelStyle={styles.switchLabel}
            label={'Biometric'}
            onSwitch={(enabled: boolean) =>
              onSwitchBiometric(enabled, biometricAuthenticatorId)
            }
            value={isBiometricEnable}
          />
        )}
      </View>
    </ContentContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '6%',
    paddingTop: '4%',
  },
  row: {
    justifyContent: 'space-between',
    marginTop: 0,
  },
  methodLabel: {
    fontSize: 22,
    fontWeight: '500',
  },
  authenticatorsHolder: {
    marginTop: '25%',
  },
  authenticatorsLabel: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  pinSwitchContainer: {
    paddingBottom: 10,
    borderBottomColor: '#d7d7d7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  biometricSwitchContainer: {
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: AppColors.textDefault,
  },
  message: {
    margin: 15,
  },
  authSelectorButton: {
    marginTop: 10,
    backgroundColor: AppColors.pureWhite,
    borderColor: AppColors.thinLines,
    borderWidth: 1,
    borderRadius: 5,
    width: 'auto',
  },
  authSelectorButtonText: {
    color: 'black',
  },
});

export default ChangeAuthView;
