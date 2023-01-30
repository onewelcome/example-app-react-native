import {useContext} from 'react';
import {AuthActionTypes} from '../providers/auth.actions';
import {AuthContext} from '../providers/auth.provider';
import {SDKError} from 'onewelcome-react-native-sdk';

export const useErrorHandling = () => {
  const {dispatch} = useContext(AuthContext);

  const logout = () => {
    dispatch({type: AuthActionTypes.AUTH_SET_AUTHORIZATION, payload: false});
  };

  const logoutOnInvalidToken = (error: any) => {
    if (!error) {
      return;
    }

    if (
      error.code === SDKError.NoProfileAuthenticated ||
      error.code === SDKError.DeviceDeregistered ||
      error.code === SDKError.UserDeregistered ||
      error.code === SDKError.UserNotAuthenticated ||
      error.code === SDKError.DeviceNotAuthenticated
    ) {
      logout();
    }
  };

  return {
    logoutOnInvalidToken,
  };
};
