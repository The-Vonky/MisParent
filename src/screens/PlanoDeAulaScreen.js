import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import MessagesModal from '../components/MessagesModal';
import NotificationModal from '../components/NotificationModal';
import ProfileMenu from '../components/ProfileMenu';

const PlanoDeAulaScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(false);

  const handleProfilePress = () => setMenuVisible(true);
  const handleNotificationPress = () => setNotificationsVisible(true);
  const handleMessagePress = () => setMessagesVisible(true);
  
  return( 

    <SafeAreaView style={styles.container}>
        <Header
          onProfilePress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
          onMessagePress={handleMessagePress}
        />

        <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        <NotificationModal visible={notificationsVisible} onClose={() => setNotificationsVisible(false)} />
        <MessagesModal visible={messagesVisible} onClose={() => setMessagesVisible(false)} />

    <View style={styles.body}>

      <View style={styles.box}>
        <Text style={styles.text}>Plano de Aula</Text>
      </View>
      
    </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 24,
  },
  noReport: {
    fontSize: 18,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },

  body: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  box: {
    width: '70%',
    height: 40,
    backgroundColor: '#F8FAFC',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#000',
    fontSize: 20,
  },
})

export default PlanoDeAulaScreen;