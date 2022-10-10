import React, {useContext} from 'react';
import DashboardScreen from '../dashboard/DashboardScreen';
import AuthScreen from '../auth/AuthScreen';
import {AuthContext} from '../../../providers/auth.provider';
import {AuthActionTypes} from '../../../providers/auth.actions';

const HomeScreen: React.FC<{}> = () => {
  const {
    state: {authorized: isAuthorized},
    dispatch,
  } = useContext(AuthContext);

  return isAuthorized ? (
    <DashboardScreen
      onLogout={() =>
        dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: false})
      }
    />
  ) : (
    <AuthScreen
      onAuthorized={() =>
        dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: true})
      }
    />
  );
};

export default HomeScreen;
