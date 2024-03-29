import React, {useContext} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {Assets} from '../../../../assets';
import RegisterButton from './components/RegisterButton';
import AuthContainer from './components/AuthContainer';
import {useNavigation} from '@react-navigation/native';
import {AuthActionTypes} from '../../../providers/auth.actions';
import {AuthContext} from '../../../providers/auth.provider';
import ContentContainer from '../dashboard/components/ContentContainer';
import {Button} from 'react-native-paper';
import AppColors from '../../constants/AppColors';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const {dispatch} = useContext(AuthContext);

  const onAuthorized = () => {
    dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: true});
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ContentContainer containerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={Assets.logo} style={styles.logo} />
        </View>
        <View style={styles.authContainer}>
          <AuthContainer onAuthorized={onAuthorized} />
        </View>

        <RegisterButton onRegistered={onAuthorized} />
        <Button
          mode="elevated"
          onPress={() => {
            navigation.navigate('InfoScreen');
          }}>
          Info
        </Button>
      </ContentContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'relative',
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'column',
    flexGrow: 1,
  },
  contentContainer: {
    flex: 2,
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
  registerContainer: {
    width: '100%',
    flex: 1,
  },
  infoContainer: {
    width: '100%',
  },
  errorText: {
    marginTop: 10,
    fontSize: 15,
    color: AppColors.error,
  },
});

export default AuthScreen;
