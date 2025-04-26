// src/components/ProfileMenu.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';


const screenWidth = Dimensions.get('window').width;

const ProfileMenu = ({ visible, onClose }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -screenWidth,
      duration: 225,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      {visible && (
        <Pressable style={styles.backdrop} onPress={onClose}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        </Pressable>
      )}

      <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>Dados do Responsável</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>Configurações</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.item}>
          <Text style={[styles.text, { color: '#ef4444' }]}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: screenWidth * 0.75,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 2,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e3a8a',
  },

  item: {
    paddingVertical: 12,
  },

  text: {
    fontSize: 16,
    color: '#1e3a8a',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
});

export default ProfileMenu;