// components/HeaderPadrao.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HeaderPadrao({ titulo }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    paddingTop: 20,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});