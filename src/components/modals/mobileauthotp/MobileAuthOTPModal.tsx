import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Modal, Text} from 'react-native';
import OneWelcomeSdk, {Events} from '@onewelcome/react-native-sdk';
import AppColors from '../../constants/AppColors';
import {Button} from 'react-native-paper';

const MobileAuthOTPModal: React.FC<{}> = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const listener = OneWelcomeSdk.addEventListener(
      Events.SdkNotification.MobileAuthOtp,
      (event: Events.MobileAuthOtpEvent) => {
        switch (event.action) {
          case Events.MobileAuthOtp.StartAuthentication:
            setMessage(event.mobileAuthenticationRequest.message);
            setVisible(true);
            break;
          case Events.MobileAuthOtp.FinishAuthentication:
            setVisible(false);
            break;
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
        <Text style={styles.title}>{'Mobile Auth OTP'}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            children={'Confirm'}
            onPress={() => {
              OneWelcomeSdk.acceptMobileAuthConfirmation();
              setVisible(false);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            children={'Cancel'}
            onPress={() => {
              OneWelcomeSdk.denyMobileAuthConfirmation();
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
  message: {
    fontSize: 16,
    marginTop: '10%',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 20,
  },
});

export default MobileAuthOTPModal;
