import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Modal, Text, TextInput} from 'react-native';
import AppColors from '../../constants/AppColors';
import OneWelcomeSdk, {Events} from '@onewelcome/react-native-sdk';
import {cancelRegistration} from '../../helpers/RegistrationHelper';
import {Button} from 'react-native-paper';

const IdProvider = '2-way-otp-api';

const TwoWayOtpApiModal: React.FC<{}> = ({}) => {
  const [codeFromOnegini, setCodeFromOnegini] = useState<string | null>(null);
  const [responseCode, setResponseCode] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listener = OneWelcomeSdk.addEventListener(
      Events.SdkNotification.CustomRegistration,
      (event: Events.CustomRegistrationEvent) => {
        if (event.identityProviderId === IdProvider) {
          switch (event.action) {
            case Events.CustomRegistration.InitRegistration:
              OneWelcomeSdk.submitCustomRegistrationAction(
                event.identityProviderId,
                null,
              );
              break;
            case Events.CustomRegistration.FinishRegistration:
              if (event.customInfo) {
                setCodeFromOnegini(event.customInfo.data);
              }
              setVisible(true);
              break;
          }
        }
      },
    );

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <Modal
      transparent={false}
      animationType="fade"
      visible={visible}
      onRequestClose={() => setVisible(false)}>
      <View style={styles.container}>
        <Text style={styles.title}>{'2-way-otp-api'}</Text>
        <Text style={styles.challengeCode}>{'Challenge Code: '}</Text>
        <Text style={styles.codeFromOnegini}>{codeFromOnegini}</Text>
        <Text style={styles.responseCodeTitle}>{'Response Code:'}</Text>
        <TextInput
          keyboardType={'numeric'}
          maxLength={6}
          style={styles.responseCodeInput}
          onChangeText={text => {
            setResponseCode(text);
          }}
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            children={'Submit'}
            onPress={() => {
              OneWelcomeSdk.submitCustomRegistrationAction(
                IdProvider,
                responseCode,
              );
              setVisible(false);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            children={'Cancel'}
            onPress={() => {
              cancelRegistration();
              setVisible(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: AppColors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    marginTop: '10%',
  },
  codeFromOnegini: {
    fontSize: 32,
    marginTop: '1%',
  },
  challengeCode: {
    fontSize: 16,
    marginTop: '10%',
  },
  responseCodeInput: {
    borderColor: AppColors.dimmed,
    width: 150,
    borderWidth: 1,
    marginTop: '10%',
  },
  responseCodeTitle: {
    fontSize: 16,
    marginTop: '10%',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 20,
  },
});

export default TwoWayOtpApiModal;
