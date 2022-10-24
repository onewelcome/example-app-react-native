import React, {useContext} from 'react';
import AuthScreen from '../auth/AuthScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/components/app/App';
import {AuthContext} from '../../../providers/auth.provider';
import {AuthActionTypes} from '../../../providers/auth.actions';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({}: Props) => {
  const {dispatch} = useContext(AuthContext);
  return (
    <AuthScreen
      onAuthorized={() => {
        dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: true});
      }}
    />
  );
};

export default HomeScreen;
