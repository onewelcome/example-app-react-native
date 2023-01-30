import {useContext} from 'react';
import {AuthActionTypes} from '../providers/auth.actions';
import {AuthContext} from '../providers/auth.provider';

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
      error.code == '8012' ||
      error.code == '9002' ||
      error.code == '9003' ||
      error.code == '9010' ||
      error.code == '10012'
    ) {
      logout();
    }
  };

  return {
    logoutOnInvalidToken,
  };
};
