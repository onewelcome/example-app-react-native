import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentContainer from './ContentContainer';
import Row from '../../../general/Row';
import Switch from '../../../general/Switch';
import {
  getAllAuthenticators,
  setPreferredAuthenticator,
} from '../../../helpers/AuthenticatorHelper';
import {isFingerprintAuthenticatorRegistered} from '../../../helpers/FingerprintHelper';
import type {Types} from 'onewelcome-react-native-sdk';
import {AuthActionTypes} from '../../../../providers/auth.actions';
import {AuthContext} from '../../../..//providers/auth.provider';
import {useActionSheet} from '@expo/react-native-action-sheet';
import Button from '../../../../components/general/Button';
import OneginiSdk from 'onewelcome-react-native-sdk';

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
  const {dispatch} = useContext(AuthContext);

  const [isfingerprintEnable, setFingerprintEnable] = useState(false);
  const [message, setMessage] = useState('');
  const [registeredAuthenticators, setRegisteredAuthenticators] = useState<
    Types.Authenticator[]
  >(emptyRegisteredAuthenticators);
  const [allAuthenticators, setAllAuthenticators] = useState<
    Types.Authenticator[]
  >(emptyRegisteredAuthenticators);
  const [preferred, setPreferred] = useState<Types.Authenticator>(
    pinRegisteredAuthenticator,
  );
  const {showActionSheetWithOptions} = useActionSheet();

  const logout = () => {
    dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: false});
  };

  const updateAuthenticators = async () => {
    isFingerprintAuthenticatorRegistered(setFingerprintEnable);
    getAllAuthenticators(
      setRegisteredAuthenticators,
      setAllAuthenticators,
      setPreferred,
    );
  };

  useEffect(() => {
    updateAuthenticators();
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
              await setPreferredAuthenticator(authenticator, setMessage);
              updateAuthenticators();
            } catch (err) {
              handleError(err);
            }
          }
        }
      },
    );
  };

  const fingerprintAuthenticatorId = allAuthenticators.find(
    auth =>
      auth.name.toUpperCase() === 'TOUCHID' ||
      auth.name.toUpperCase() === 'FINGERPRINT',
  )?.id;

  const renderMessage = (msg: string) => {
    if (msg !== '') {
      return <Text style={styles.message}>{msg}</Text>;
    } else {
      return;
    }
  };

  const onSwitchFingerprint = async (
    enabled: boolean,
    authenticatorId: string,
  ) => {
    try {
      if (enabled) {
        await OneginiSdk.registerAuthenticator(authenticatorId);
        await updateAuthenticators();
      } else {
        await OneginiSdk.deregisterAuthenticator(authenticatorId);
        await updateAuthenticators();
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (error: any) => {
    if (!error) {
      return;
    }
    // eslint-disable-next-line eqeqeq
    if (error.code == '9002' || error.code == '9003') {
      logout();
    } else {
      setMessage(error.message);
    }
  };

  return (
    <ContentContainer containerStyle={styles.container}>
      {renderMessage(message)}
      <Row containerStyle={styles.row}>
        <Text style={styles.methodLabel}>Login Method</Text>
        <Button
          name={preferred.name}
          disabled={
            !registeredAuthenticators || registeredAuthenticators.length < 1
          }
          containerStyle={styles.authSelectorButton}
          textStyle={styles.authSelectorButtonText}
          onPress={() => {
            showPreferredAuthenticatorSelector();
          }}
        />
      </Row>
      <View style={styles.authenticatorsHolder}>
        <Text style={styles.authenticatorsLabel}>Possible authenticators:</Text>
        <Switch
          containerStyle={styles.pinSwitchContainer}
          labelStyle={styles.switchLabel}
          label={'PIN'}
          value={true}
          disabled={true}
        />
        {fingerprintAuthenticatorId !== undefined && (
          <Switch
            containerStyle={styles.fingerprintSwitchContainer}
            labelStyle={styles.switchLabel}
            label={'Fingerprint'}
            onSwitch={(enabled: boolean) =>
              onSwitchFingerprint(enabled, fingerprintAuthenticatorId)
            }
            value={isfingerprintEnable}
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
    color: '#1e8dca',
    fontSize: 22,
    fontWeight: '500',
  },
  methodText: {
    color: '#777777',
    fontSize: 22,
    fontWeight: '400',
  },
  authenticatorsHolder: {
    marginTop: '25%',
  },
  authenticatorsLabel: {
    color: '#1e8dca',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  pinSwitchContainer: {
    paddingBottom: 10,
    borderBottomColor: '#d7d7d7',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fingerprintSwitchContainer: {
    paddingTop: 10,
  },
  switchLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#7c7c7c',
  },
  message: {
    margin: 15,
  },
  authSelectorButton: {
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 5,
    width: undefined,
  },
  authSelectorButtonText: {
    color: 'black',
  },
});

export default ChangeAuthView;
