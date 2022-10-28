import React, {useContext, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import Switch from '../../general/Switch';
import {Assets} from '../../../../assets';
import RegisterButton from './components/RegisterButton';
import AuthContainer from './components/AuthContainer';
import Button from '../../general/Button';
import {useNavigation} from '@react-navigation/native';
import {AuthActionTypes} from '../../../providers/auth.actions';
import {AuthContext} from '../../../providers/auth.provider';
import ContentContainer from '../dashboard/components/ContentContainer';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const {dispatch} = useContext(AuthContext);

  const onAuthorized = () => {
    dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: true});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ContentContainer containerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={Assets.logo} />
          <Text style={styles.logoText}>Example App</Text>
        </View>
        <View style={styles.authContainer}>
          <AuthContainer onAuthorized={onAuthorized} />
        </View>

        <RegisterButton onRegistered={onAuthorized} />
        <View style={styles.infoContainer}>
          <Button
            name="INFO"
            onPress={() => {
              navigation.navigate('InfoScreen');
            }}
          />
        </View>
      </ContentContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'column',
    minHeight: '100%',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 30,
  },
  authContainer: {
    paddingTop: 50,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logoText: {
    textAlign: 'right',
    width: '100%',
    color: '#777777',
    fontSize: 20,
    fontWeight: '400',
  },
  registerContainer: {
    width: '100%',
    flex: 1,
  },
  switch: {
    marginTop: 10,
    marginBottom: 'auto',
  },
  infoContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  errorText: {
    marginTop: 10,
    fontSize: 15,
    color: '#c82d2d',
  },
});

export default AuthScreen;
