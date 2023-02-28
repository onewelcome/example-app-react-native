import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

interface Props {
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
}

const Row: React.FC<Props> = ({containerStyle, children}) => {
  return <View style={[styles.container, containerStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Row;
