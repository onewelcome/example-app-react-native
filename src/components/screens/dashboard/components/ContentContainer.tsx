import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import AppColors from '../../../constants/AppColors';

interface Props {
  containerStyle?: ViewStyle;
}

const ContentContainer: React.FC<Props> = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
    width: '100%',
    flex: 1,
    paddingHorizontal: '12%',
  },
});

export default ContentContainer;
