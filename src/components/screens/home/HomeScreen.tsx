import React from 'react';
import AuthScreen from '../auth/AuthScreen';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/components/app/App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  return (
    <AuthScreen
      onAuthorized={() => {
        navigation.navigate('DashboardScreen');
      }}
    />
  );
};

export default HomeScreen;
