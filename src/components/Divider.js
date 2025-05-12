import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
    marginHorizontal: 20,
    borderRadius: 8,
  },
});

export default Divider;
