import {StyleSheet, View, Image} from 'react-native';
import {Assets} from '../../../../assets';
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={Assets.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
