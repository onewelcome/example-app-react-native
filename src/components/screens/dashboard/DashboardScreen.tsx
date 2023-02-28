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
import Button from '../../../components/general/Button';
import ContentContainer from './components/ContentContainer';
import {CurrentUser} from '../../../auth/auth';
import {AuthContext} from '../../../providers/auth.provider';
import {AuthActionTypes} from '../../../providers/auth.actions';
import {logout, deregisterUser} from '../../helpers/DashboardHelpers';
import {useFocusEffect} from '@react-navigation/native';
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
          containerStyle={styles.button}
          name="YOUR DEVICES"
          onPress={() => navigation.navigate('DevicesScreen')}
        />
        <Button
          containerStyle={styles.button}
          name="MOBILE AUTH WITH OTP"
          onPress={() => navigation.navigate('OTPScreen')}
        />
        <Button
          containerStyle={styles.button}
          name="SINGLE SIGN-ON"
          onPress={() => singleSingOn()}
        />
        <Button
          containerStyle={styles.button}
          name="SETTINGS"
          onPress={() => navigation.navigate('SettingsScreen')}
        />
        <Button
          containerStyle={styles.button}
          name="DEREGISTER"
          onPress={() => {
            deregisterUser(onLogout);
          }}
        />
        <Button
          containerStyle={styles.button}
          name="LOGOUT"
          onPress={() => {
            logout(onLogout);
          }}
        />
        <Button
          containerStyle={styles.button}
          name="ACCESS TOKEN"
          onPress={() => {
            showAccessToken();
          }}
        />
      </ContentContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  helloText: {
    paddingTop: 15,
    color: '#1e8dca',
    fontSize: 22,
    fontWeight: '400',
  },
  button: {
    marginVertical: 14,
    flex: 1,
  },
});

export default DashboardScreen;
