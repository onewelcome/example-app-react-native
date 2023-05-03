import React, {useCallback, useContext} from 'react';
import {
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  Linking,
  BackHandler,
} from 'react-native';
import OneWelcomeSdk from 'onewelcome-react-native-sdk';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../app/App';
import ContentContainer from './components/ContentContainer';
import {CurrentUser} from '../../../auth/auth';
import {AuthContext} from '../../../providers/auth.provider';
import {AuthActionTypes} from '../../../providers/auth.actions';
import {logout, deregisterUser} from '../../helpers/DashboardHelpers';
import {useFocusEffect} from '@react-navigation/native';
import AppColors from '../../../components/constants/AppColors';
import {Button} from 'react-native-paper';
import {useErrorHandling} from '../../../helpers/useErrorHandling';

type Props = NativeStackScreenProps<RootStackParamList, 'DashboardScreen'>;

const DashboardScreen = ({navigation}: Props) => {
  const {dispatch} = useContext(AuthContext);
  const {logoutOnInvalidToken} = useErrorHandling();
  function showAccessToken() {
    OneWelcomeSdk.getAccessToken()
      .then(token => Alert.alert('Access Token', token))
      .catch(() => Alert.alert('Error!', 'Could not get AccessToken!'));
  }

  const singleSingOn = () => {
    OneWelcomeSdk.startSingleSignOn(
      'https://login-mobile.test.onegini.com/personal/dashboard',
    )
      .then(it => {
        Linking.openURL(it.url);
      })
      .catch(error => {
        logoutOnInvalidToken(error);
        Alert.alert(`Error code: ${error.code}`, `${error.message}`);
      });
  };

  const onLogout = useCallback(() => {
    dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: false});
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Log out?', '', [
          {text: 'Cancel', style: 'cancel', onPress: () => {}},
          {
            text: 'Log out',
            style: 'destructive',
            onPress: () => onLogout(),
          },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [onLogout]),
  );

  return (
    <ScrollView style={styles.container}>
      <ContentContainer>
        <Text style={styles.helloText}>{`Hello user: ${CurrentUser.id}`}</Text>
        <Button
          style={styles.button}
          mode="elevated"
          children="Your devices"
          onPress={() => navigation.navigate('DevicesScreen')}
        />
        <Button
          style={styles.button}
          mode="elevated"
          children="Mobile Auth with OTP"
          onPress={() => navigation.navigate('OTPScreen')}
        />
        <Button
          style={styles.button}
          mode="elevated"
          children="Single Sign-On"
          onPress={() => singleSingOn()}
        />
        <Button
          style={styles.button}
          mode="elevated"
          children="Settings"
          onPress={() => navigation.navigate('SettingsScreen')}
        />
        <Button
          style={styles.button}
          mode="elevated"
          children="Deregister"
          onPress={() => {
            deregisterUser(onLogout);
          }}
        />
        <Button
          style={styles.button}
          mode="elevated"
          children="Access token"
          onPress={() => {
            showAccessToken();
          }}
        />
        <Button
          style={styles.button}
          mode="elevated"
          children="Logout"
          onPress={() => {
            logout(onLogout);
          }}
        />
      </ContentContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  helloText: {
    paddingTop: 15,
    color: AppColors.info,
    fontSize: 22,
    fontWeight: '400',
  },
  button: {
    marginVertical: 10,
    flex: 1,
  },
});

export default DashboardScreen;
