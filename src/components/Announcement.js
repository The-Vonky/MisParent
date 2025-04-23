import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Announcement = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Avisos</Text>
    <Image
      source={require('../../assets/jorel.jpg')}
      style={styles.image}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 16 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  image: { width: 250, height: 150, borderRadius: 12 }
});

export default Announcement;
