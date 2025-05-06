import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AlertMessage({ message, type = 'info' }) {
  if (!message) return null;

  return (
    <View style={[styles.container, typeStyles[type]]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});

const typeStyles = {
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#f44336',
  },
  info: {
    backgroundColor: '#2196F3',
  },
  warning: {
    backgroundColor: '#FF9800',
  },
};
