import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Switch from '../../../general/Switch';
import OneWelcomeSdk from '@onewelcome/react-native-sdk';
import {CurrentUser} from '../../../../auth/auth';
import {AuthContext} from '../../../../providers/auth.provider';
import {AuthActionTypes} from '../../../../providers/auth.actions';
import {useActionSheet} from '@expo/react-native-action-sheet';
import AppColors from '../../../constants/AppColors';
import {Button} from 'react-native-paper';

interface Props {
  onAuthorized?: (success: boolean) => void;
}

const AuthContainer: React.FC<Props> = props => {
  const [error, setError] = useState<string | null>(null);
  const [enablePreferedAuthenticator, setEnablePreferedAuthenticator] =
    useState<boolean>(true);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const {showActionSheetWithOptions} = useActionSheet();

  const showAuthenticatorSelector = async (profileId: string) => {
    const authenticators = await OneWelcomeSdk.getRegisteredAuthenticators(
      profileId,
    );
    const authenticatorNames = authenticators.map(
      authenticator => authenticator.name,
    );
    const options = authenticatorNames.concat(['Cancel']);
    const cancelButtonIndex = options.length - 1;
    const message = 'Choose an authenticator to log in with.';
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        message,
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined && selectedIndex < options.length - 1) {
          let authenticator = authenticators[selectedIndex];
          if (authenticator) {
            handleSelectAuthenticator(authenticator.id);
          }
        }
      },
    );
  };

  const showProfileSelector = async () => {
    const profiles = await OneWelcomeSdk.getUserProfiles();
    const profileIds = profiles.map(profile => profile.id);
    const options = profileIds.concat(['Cancel']);
    const cancelButtonIndex = options.length - 1;
    const message = 'Choose a profile.';
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        message,
      },
      (selectedIndex: number | undefined) => {
        if (selectedIndex !== undefined && selectedIndex < options.length - 1) {
          setSelectedProfileId(profileIds[selectedIndex] ?? '');
        }
      },
    );
  };

  const {
    state: {
      authenticated: {loading, profiles},
    },
    dispatch,
  } = useContext(AuthContext);

  const fetchProfiles = useCallback(async () => {
    try {
      dispatch({type: AuthActionTypes.AUTH_LOAD_PROFILE_IDS});
      const userProfiles = await OneWelcomeSdk.getUserProfiles();
      dispatch({
        type: AuthActionTypes.AUTH_SET_PROFILE_IDS,
        payload: userProfiles?.map(({id}) => id) || [],
      });
    } catch (e: any) {
      setError(e.message);
      dispatch({type: AuthActionTypes.AUTH_SET_PROFILE_IDS, payload: []});
    }
  }, [dispatch]);

  const authenticateProfile = useCallback(
    async (id: string, authenticatorId?: string) => {
      try {
        await OneWelcomeSdk.authenticateUser(id, authenticatorId ?? null);
        CurrentUser.id = id;
        props.onAuthorized?.(true);
      } catch (e: any) {
        setError(e.message);
        fetchProfiles();
      }
    },
    [fetchProfiles, props],
  );

  useEffect(() => {
    if (!loading) {
      fetchProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let profile = profiles?.find(profile_ => {
      return profile_.id === selectedProfileId;
    });
    if (!profile) {
      profile = profiles?.length ? profiles[0] : undefined;
      setSelectedProfileId(profile?.id ?? '');
    }
  }, [profiles, selectedProfileId]);

  const handleSelectAuthenticator = useCallback(
    async (authenticatorId: string) => {
      authenticateProfile(selectedProfileId, authenticatorId);
    },
    [authenticateProfile, selectedProfileId],
  );

  return (
    <View style={styles.container}>
      <Button
        children={
          selectedProfileId ? selectedProfileId : 'No registered profile'
        }
        disabled={!profiles || profiles.length < 1}
        textColor={AppColors.textDefault}
        style={styles.profileSelectorButtonContainer}
        onPress={() => {
          showProfileSelector();
        }}
      />
      <Button
        mode="contained"
        disabled={!profiles || profiles.length < 1}
        onPress={() => {
          enablePreferedAuthenticator
            ? authenticateProfile(selectedProfileId)
            : showAuthenticatorSelector(selectedProfileId);
        }}>
        {enablePreferedAuthenticator ? 'Log in' : 'Log in with ...'}
      </Button>

      <Switch
        label={'Use preferred authenticator'}
        onSwitch={() => {
          setEnablePreferedAuthenticator(!enablePreferedAuthenticator);
        }}
        value={enablePreferedAuthenticator}
        containerStyle={styles.switch}
      />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  switch: {
    marginTop: 10,
  },
  errorText: {
    marginTop: 10,
    fontSize: 15,
    color: AppColors.error,
  },
  modal: {
    width: '100%',
  },
  button: {
    marginTop: 10,
    paddingHorizontal: 40,
  },
  profileSelectorButton: {
    backgroundColor: AppColors.pureWhite,
    paddingHorizontal: 20,
  },
  profileSelectorButtonContainer: {
    borderWidth: 1,
    borderColor: AppColors.thinLines,
    borderRadius: 5,
    backgroundColor: AppColors.pureWhite,
    marginBottom: 10,
  },
});

export default AuthContainer;
