import React, {useCallback, useState} from 'react';
import {Text, StyleSheet, Alert} from 'react-native';
import ContentContainer from './ContentContainer';
import {enrollMobileAuthentication} from '../../../helpers/MobileAuthenticationHelper';
import OneWelcomeSdk from 'onewelcome-react-native-sdk';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../app/App';
import {Button} from 'react-native-paper';
import {useErrorHandling} from '../../../../helpers/useErrorHandling';

type Props = NativeStackScreenProps<RootStackParamList, 'SettingsScreen'>;

const SettingsActionsView = ({navigation}: Props) => {
  const [message, setMessage] = useState('');
  const {logoutOnInvalidToken} = useErrorHandling();

  const onChangePinPressed = useCallback(async () => {
    try {
      await OneWelcomeSdk.changePin();
      Alert.alert('Success', 'PIN changed successfully');
    } catch (error: any) {
      if (error.message) {
        Alert.alert('Error', error.message);
      }
      // Although changing pin in local, we can still use this in the case
      //   of deregistration when supplying invalid pin too often
      logoutOnInvalidToken(error);
    }
  }, [logoutOnInvalidToken]);

  return (
    <ContentContainer>
      <Text>{message}</Text>
      <Button
        style={styles.button}
        mode="elevated"
        children="Enroll for mobile auth"
        onPress={() => {
          setMessage('');
          enrollMobileAuthentication(setMessage, setMessage);
        }}
      />
      <Button
        style={styles.button}
        mode="elevated"
        children="Change pin "
        onPress={onChangePinPressed}
      />
      <Button
        style={styles.button}
        mode="elevated"
        children="Change authentication"
        onPress={() => {
          navigation.navigate('ChangeAuthScreen');
        }}
      />
    </ContentContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
});

export default SettingsActionsView;
