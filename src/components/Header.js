import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Bell, MessageSquare } from 'lucide-react-native';
import NotificationModal from '../components/NotificationModal';
import MessageModal from '../components/MessagesModal';

const Header = ({ userName = 'James', onProfilePress }) => {
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [isMessageVisible, setMessageVisible] = useState(false);

  const openNotifications = () => {
    setNotificationVisible(true);
  };

  const closeNotifications = () => {
    setNotificationVisible(false);
  };

  const openMessages = () => {
    setMessageVisible(true);
  };

  const closeMessages = () => {
    setMessageVisible(false);
  };

  return (
    <View style={styles.header}>
      {/* Barra de status azul escura com texto claro */}
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      <View style={styles.left}>
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={{ uri: 'https://www.pintarcolorir.com.br/wp-content/uploads/2015/04/Desenhos-para-colorir-de-alunos-01-172x159.jpg' }}
            style={styles.profile}
          />
        </TouchableOpacity>
        <Text style={styles.welcome}>Bem-vindo,</Text>
        <Text style={styles.name}>{userName}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity style={styles.icon} onPress={openNotifications}>
          <Bell color="#fff" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={openMessages}>
          <MessageSquare color="#fff" size={20} />
        </TouchableOpacity>

        <Image
          source={require('../../assets/Logo.png')}
          style={styles.logo}
        />
      </View>

      <NotificationModal visible={isNotificationVisible} onClose={closeNotifications} />
      <MessageModal visible={isMessageVisible} onClose={closeMessages} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
    marginRight: 4,
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
