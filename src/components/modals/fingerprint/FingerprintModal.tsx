import React from 'react';
import {StyleSheet, View, Modal, Text} from 'react-native';
import {Events} from 'onewelcome-react-native-sdk';
import AppColors from '../../constants/AppColors';
import {useFingerprintFlow} from '../../../helpers/useFingerprintFlow';
import {Button} from 'react-native-paper';

const MESSAGE_BY_STAGE: Map<Events.FingerprintStage, string> = new Map([
  [Events.FingerprintStage.Idle, 'Waiting for fingerprint flow trigger...'],
  [Events.FingerprintStage.Started, 'Use Fingerprint Sensor'],
  [Events.FingerprintStage.NextAttempt, 'Try again...'],
  [Events.FingerprintStage.Captured, 'Verifying...'],
  [Events.FingerprintStage.Finished, 'Done'],
]);

const FingerprintModal: React.FC<{}> = () => {
  const {active, stage, fallbackToPin, cancelFlow} = useFingerprintFlow();
  const message = MESSAGE_BY_STAGE.get(stage);

  return (
    <Modal
      transparent={false}
      animationType="fade"
      visible={active}
      onRequestClose={() => null}>
      <View style={styles.container}>
        <Text style={styles.title}>{'Confirm with fingerprint'}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="elevated"
            children={'Use pin code'}
            onPress={() => fallbackToPin()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode="elevated"
            children={'Cancel'}
            onPress={() => cancelFlow()}
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

export default FingerprintModal;
