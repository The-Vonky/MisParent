import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import MessagesModal from '../components/MessagesModal';
import NotificationModal from '../components/NotificationModal';
import ProfileMenu from '../components/ProfileMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';


const escolhas = {
  'Matéria': [
    { id: '1', materia: 'Português' },
    { id: '2', materia: 'Inglês' },
    { id: '3', materia: 'História' },
    { id: '4', materia: 'Matemática' },
    { id: '5', materia: 'Geografia' },
  ],
};

const PlanoDeAulaScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [messagesVisible, setMessagesVisible] = useState(false);

  const navigation = useNavigation();

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
      
      {escolhas['Matéria'].map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate('PlanoDeAulaDetalhado', { materia: item.materia })}
        >
        <View style={styles.box2}>
          <Text style={styles.text}>{item.materia}</Text>
          <Ionicons name="chevron-forward" size={20} />
        </View>
      </TouchableOpacity>
      ))}


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
    gap: 40,
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

  box2: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    width: '85%',
    height: 40,
    backgroundColor: '#F8FAFC',

    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  text: {
    color: '#000',
    fontSize: 20,
  },

})

export default PlanoDeAulaScreen;