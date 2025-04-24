// src/components/Header.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, MessageSquare } from 'lucide-react-native';
import ProfileMenu from './ProfileMenu';

const Header = ({ userName = 'Deywid' }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <View style={styles.header}>
        {/* Esquerda: Foto + Nome */}
        <View style={styles.left}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={require('../../assets/jorel.jpg')}
              style={styles.profile}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.welcome}>Bem-vindo,</Text>
            <Text style={styles.name}>{userName}</Text>
          </View>
        </View>

        {/* Direita: Ícones e logo */}
        <View style={styles.right}>
          <TouchableOpacity style={styles.icon}>
            <Bell color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <MessageSquare color="#fff" size={20} />
          </TouchableOpacity>
          <Image
            source={require('../../assets/Logo.png')}
            style={styles.logo}
          />
        </View>
      </View>

      {/* Menu deslizante */}
      <ProfileMenu visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 5, // abaixo do modal
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  welcome: {
    color: '#e0e7ff',
    fontSize: 14,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 12,
  },
  logo: {
    width: 36,
    height: 36,
    marginLeft: 12,
    resizeMode: 'contain',
  },
});

export default Header;
