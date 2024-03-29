import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import AppColors from '../../constants/AppColors';
import {Types} from '@onewelcome/react-native-sdk';
import {useResources} from '../../../helpers/useResource';

interface RenderDevice {
  id: string;
  name: string;
  application: string;
  platform: string;
}

//@todo resolve this with more types for resources
const getData = (data: any, key: string) => {
  if (data[key]) {
    return data[key];
  } else {
    return `No data for key: ${key}`;
  }
};

const DevicesView: React.FC<{}> = () => {
  const {loading, data, error} = useResources(
    Types.ResourceRequestType.User,
    {
      method: Types.ResourceMethod.GET,
      headers: {},
      path: 'devices',
    },
    false,
    ['devices'],
  );
  const [devices, setDevices] = useState<RenderDevice[] | undefined>(undefined);

  useEffect(() => {
    if (data) {
      const mappedData =
        typeof data === 'string' || (data as any) instanceof String
          ? JSON.parse(data as unknown as string)
          : data;
      setDevices(mappedData.devices);
    }
  }, [setDevices, data]);

  return (
    <ScrollView style={styles.container}>
      {loading && <Text style={styles.loading}>{'loading ...'}</Text>}
      {error && (
        <Text style={[styles.loading, {color: AppColors.error}]}>
          {getData(error, 'message')}
        </Text>
      )}
      {data && !loading && !error && (
        <View style={styles.scrollViewContainer}>
          {devices?.map(({name, application, platform, id}) => (
            <View key={id} style={styles.device}>
              <Text style={styles.info}>{`name: ${name}`}</Text>
              <Text style={styles.info}>{`application: ${application}`}</Text>
              <Text style={styles.info}>{`platform: ${platform}`}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: '15%',
    paddingHorizontal: '4%',
  },
  scrollViewContainer: {
    paddingBottom: '15%',
  },
  device: {
    marginTop: '5%',
    borderRadius: 4,
    backgroundColor: AppColors.backgroundElevated,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    padding: '5%',
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    color: AppColors.textDefault,
    fontSize: 24,
    fontWeight: '500',
  },

  loadingContainer: {
    top: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    justifyContent: 'center',
    color: AppColors.textDefault,
    fontSize: 12,
    fontWeight: '500',
    padding: 6,
  },
});

export default DevicesView;
