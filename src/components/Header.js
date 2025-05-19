import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, BetweenHorizonalEnd, MessageSquare } from 'lucide-react-native';
import NotificationModal from '../components/NotificationModal';
import MessageModal from '../components/MessagesModal';

const Header = ({ userName = 'Gandalf', onProfilePress }) => {
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
      <View style={styles.left}>
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={{ uri: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2017/07/Sir-Ian-McKellen-as-Gandalf-The-Grey-The-Shire-Lord-of-the-Rings-Peter-Jackson.jpg' }}
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

      {/* Aqui estão os modais */}
      <NotificationModal visible={isNotificationVisible} onClose={closeNotifications} />
      <MessageModal visible={isMessageVisible} onClose={closeMessages} />
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