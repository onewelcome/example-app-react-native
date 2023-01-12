import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Switch from '../../../general/Switch';
import Button from '../../../general/Button';
import OneWelcomeSdk from 'onewelcome-react-native-sdk';
import {CurrentUser} from '../../../../auth/auth';
import {AuthContext} from '../../../../providers/auth.provider';
import {AuthActionTypes} from '../../../../providers/auth.actions';
import {useActionSheet} from '@expo/react-native-action-sheet';

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
        name={selectedProfileId ? selectedProfileId : 'No registered profile'}
        disabled={!profiles || profiles.length < 1}
        containerStyle={styles.profileSelectorButton}
        textStyle={styles.profileSelectorButtonText}
        onPress={() => {
          showProfileSelector();
        }}
      />
      <Button
        name={enablePreferedAuthenticator ? 'LOG IN' : 'LOG IN WITH ...'}
        disabled={!profiles || profiles.length < 1}
        containerStyle={styles.button}
        onPress={() => {
          enablePreferedAuthenticator
            ? authenticateProfile(selectedProfileId)
            : showAuthenticatorSelector(selectedProfileId);
        }}
      />
      <Switch
        label={'USE PREFERRED AUTHENTICATOR'}
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
    color: '#c82d2d',
  },
  modal: {
    width: '100%',
  },
  button: {
    marginTop: 10,
  },
  profileSelectorButton: {
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 5,
  },
  profileSelectorButtonText: {
    color: 'black',
  },
});

export default AuthContainer;
