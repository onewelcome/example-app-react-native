import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentContainer from '../dashboard/components/ContentContainer';
import AppColors from '../../constants/AppColors';
import OneWelcomeSdk, {Types} from '@onewelcome/react-native-sdk';
import {useResources} from '../../../helpers/useResource';
import type {RootStackParamList} from '../../app/App';

type Props = NativeStackScreenProps<RootStackParamList, 'InfoScreen'>;

const getProfileData = async (
  setProfileError: (error: string | null) => void,
  setProfileId: (profileId: string | null) => void,
) => {
  try {
    const profiles = await OneWelcomeSdk.getUserProfiles();

    if (profiles[0]) {
      setProfileId(profiles[0].id);
    } else {
      setProfileError('No profiles registered.');
    }
  } catch (e: any) {
    setProfileError(e);
  }
};

//@todo resolve this with more types for resources
const getData = (data: any, key: string) => {
  if (typeof data === 'string' || data instanceof String) {
    data = JSON.parse(data as string);
  }
  if (data[key]) {
    return data[key];
  } else {
    return `No data for key: ${key}`;
  }
};

const InfoScreen = ({}: Props) => {
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  const implicitResource = useResources(
    Types.ResourceRequestType.Implicit,
    {
      method: Types.ResourceMethod.GET,
      path: 'user-id-decorated',
    },
    true,
    [],
    profileId,
  );

  const resource = useResources(
    Types.ResourceRequestType.Anonymous,
    {
      method: Types.ResourceMethod.GET,
      headers: {'custom-header1': 'val1', 'custom-header2': 'val2'},
      path: 'application-details',
    },
    true,
    ['application-details'],
  );

  // get profileId at start
  useEffect(() => {
    getProfileData(setProfileError, setProfileId);
  }, []);

  return (
    <ContentContainer containerStyle={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>User Info</Text>
        {implicitResource.loading && !profileError && (
          <Text style={styles.info}>{'Loading...'}</Text>
        )}
        {profileError && (
          <Text style={styles.infoError}>{'Error:  ' + profileError}</Text>
        )}
        {implicitResource.error && (
          <Text style={styles.infoError}>
            {'Implicit Error:  ' + implicitResource.error}
          </Text>
        )}
        {profileId && (
          <Text style={styles.info}>{'Profile id:  ' + profileId}</Text>
        )}
        {implicitResource.data && (
          <Text style={styles.info}>{`Implicit details: ${getData(
            implicitResource.data,
            'decorated_user_id',
          )}`}</Text>
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Device details</Text>
        {resource.loading && <Text style={styles.info}>{'Loading...'}</Text>}
        {resource.error && (
          <Text style={styles.infoError}>
            {'Resource Error:  ' + resource.error}
          </Text>
        )}
        {resource.data && (
          <>
            <Text style={styles.info}>{`Application ID: ${getData(
              resource.data,
              'application_identifier',
            )}`}</Text>
            <Text style={styles.info}>{`Application Version: ${getData(
              resource.data,
              'application_platform',
            )}`}</Text>
            <Text style={styles.info}>{`Platform: ${getData(
              resource.data,
              'application_version',
            )}`}</Text>
          </>
        )}
      </View>
    </ContentContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '6%',
    paddingTop: '4%',
  },
  row: {
    paddingHorizontal: '10%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  label: {
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: '500',
  },
  info: {
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: '500',
    padding: 6,
  },
  infoError: {
    justifyContent: 'center',
    color: AppColors.error,
    fontSize: 12,
    fontWeight: '500',
    padding: 6,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});

export default InfoScreen;
