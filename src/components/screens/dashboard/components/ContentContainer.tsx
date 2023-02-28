import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

interface Props {
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
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
    backgroundColor: '#ffffff',
    paddingHorizontal: '12%',
  },
});

export default ContentContainer;
