import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {Events} from 'onewelcome-react-native-sdk';
import PinInput from './PinInput';
import PinKeyboard from './PinKeyboard';
import {usePinFlow} from '../../../helpers/usePinFlow';
import AppColors from '../../constants/AppColors';
import {Button} from 'react-native-paper';

const getTitle = (flow: Events.PinFlow) => {
  switch (flow) {
    case Events.PinFlow.Create:
      return 'Create Pin';
    case Events.PinFlow.Authentication:
      return 'Current Pin';
    default:
      return 'Create Pin';
  }
};

const PinModal: React.FC<{}> = () => {
  const {
    flow,
    pin,
    visible,
    isConfirmMode,
    error,
    provideNewPinKey,
    cancelPinFlow,
    pinLength,
  } = usePinFlow();

  const title = isConfirmMode ? 'Confirm Pin' : getTitle(flow);

  return (
    <Modal
      transparent={false}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {
        console.log('PIN MODAL: ON REQUEST CLOSE');
        cancelPinFlow();
      }}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.pinBulletsContainer}>
            <Text style={styles.subText}>Please enter your PIN code</Text>
            <PinInput
              currentPinLength={pin.length}
              requiredPinLength={pinLength}
            />
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
        <View style={styles.bottomContainer}>
          <PinKeyboard
            pinLength={pin.length}
            onPress={newKey => provideNewPinKey(newKey)}
          />
          <View style={styles.cancelWrapper}>
            <Button
              mode="outlined"
              children={'Cancel'}
              onPress={() => cancelPinFlow()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  subText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 30,
  },
  pinBulletsContainer: {
    marginTop: '20%',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: AppColors.backgroundElevated,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginTop: '10%',
    color: AppColors.textDefault,
  },
  error: {
    marginTop: '8%',
    fontSize: 22,
    color: AppColors.error,
    textAlign: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  cancelWrapper: {
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: AppColors.pureWhite,
    color: AppColors.textDefault,
    paddingHorizontal: 40,
    borderColor: AppColors.primary,
    borderWidth: 2,
    borderRadius: 50,
  },
});

export default PinModal;
