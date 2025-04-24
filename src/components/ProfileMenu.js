// src/components/ProfileMenu.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ProfileMenu = ({ visible, onClose }) => {
  const translateX = React.useRef(new Animated.Value(-screenWidth)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible && translateX._value <= -screenWidth + 10) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      onPress={onClose}
      activeOpacity={1}
    >
      <Animated.View
        style={[styles.menu, { transform: [{ translateX }] }]}
      >
        <Text style={styles.title}>Perfil</Text>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>Dados do Responsável</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
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
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e3a8a',
  },
  item: {
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    color: '#1e3a8a',
  },
});

export default ProfileMenu;
