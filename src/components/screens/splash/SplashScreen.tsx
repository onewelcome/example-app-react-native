import {StyleSheet, View, Image} from 'react-native';
import {Assets} from '../../../../assets';
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {<Image source={Assets.logo} style={styles.logo} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
