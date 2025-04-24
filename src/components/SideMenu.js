// src/components/SideMenu.js
import React, { useRef, useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.75;

const SideMenu = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -MENU_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  return (
    <>
      {visible && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.menu, { left: slideAnim }]}>
        <Text style={styles.title}>👤 Deywid</Text>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Mensagens</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Avisos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0006',
  },
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: '#1e3a8a',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  option: {
    marginVertical: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SideMenu;
