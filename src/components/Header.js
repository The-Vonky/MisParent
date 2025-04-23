// src/components/Header.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, MessageSquare } from 'lucide-react-native';

const Header = ({ userName = 'Deywid' }) => {
  return (
    <View style={styles.header}>
      {/* Esquerda: Foto + Nome */}
      <View style={styles.leftSection}>
        <Image source={require('../../assets/jorel.jpg')} style={styles.profilePic} />
        <Text style={styles.userName}>Bem-vindo, {userName}</Text>
      </View>

      {/* Direita: Ícones + Logo */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Bell color="#fff" size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <MessageSquare color="#fff" size={22} />
        </TouchableOpacity>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
      </View>
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
    elevation: 4,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginLeft: 12,
    padding: 4,
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginLeft: 12,
  },
});

export default Header;