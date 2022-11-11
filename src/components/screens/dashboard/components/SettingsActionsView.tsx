import React, {useCallback, useContext, useState} from 'react';
import {Text, StyleSheet, Alert} from 'react-native';
import ContentContainer from './ContentContainer';
import Button from '../../../general/Button';
import {enrollMobileAuthentication} from '../../../helpers/MobileAuthenticationHelper';
import OneWelcomeSdk from 'onewelcome-react-native-sdk';
import {AuthContext} from '../../../../providers/auth.provider';
import {AuthActionTypes} from '../../../../providers/auth.actions';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from 'src/components/app/App';

type Props = NativeStackScreenProps<RootStackParamList, 'SettingsScreen'>;

const SettingsActionsView = ({navigation}: Props) => {
  const {dispatch} = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const onChangePinPressed = useCallback(async () => {
    try {
      await OneWelcomeSdk.changePin();
      Alert.alert('Success', 'PIN changed successfully');
    } catch (e: any) {
      if (e.message && e.code !== 9006) {
        Alert.alert('Error', e.message);
      }
      // eslint-disable-next-line eqeqeq
      if (e.code == '9003') {
        dispatch({
          type: AuthActionTypes.AUTH_SET_AUTHORIZATION,
          payload: false,
        });
      }
    }
  }, [dispatch]);

  return (
    <ContentContainer>
      <Text>{message}</Text>
      <Button
        containerStyle={styles.button}
        name={'ENROLL FOR MOBILE AUTH'}
        onPress={() => {
          setMessage('');
          enrollMobileAuthentication(setMessage, setMessage);
        }}
      />
      <Button
        containerStyle={styles.button}
        name={'CHANGE PIN'}
        onPress={onChangePinPressed}
      />
      <Button
        containerStyle={styles.button}
        name={'CHANGE AUTHENTICATION'}
        onPress={() => {
          navigation.navigate('ChangeAuthScreen');
        }}
      />
    </ContentContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 14,
  },
});

export default SettingsActionsView;
