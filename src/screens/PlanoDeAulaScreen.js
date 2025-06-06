import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import MessagesModal from '../components/MessagesModal';
import NotificationModal from '../components/NotificationModal';
import ProfileMenu from '../components/ProfileMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { ImageBackground, Dimensions } from 'react-native';



const escolhas = {
  'Matéria': [
    { id: '1', materia: 'Português' },
    { id: '2', materia: 'Inglês' },
    { id: '3', materia: 'História' },
    { id: '4', materia: 'Matemática' },
    { id: '5', materia: 'Geografia' },
  ],
};


const { width, height } = Dimensions.get('window');

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
      <ImageBackground
      source={require('../../assets/backgroundMis.png')}
      style={{ flex: 1}}
      resizeMode="cover"
    >
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
        <Feather name="log-out" size={30} color="#FF0000" onPress={() => navigation.navigate('Home')} />
        <Text style={styles.text}>Plano de Aula</Text>
      </View>
      
      {escolhas['Matéria'].map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate('PlanoDeAulaDetalhado', { materia: item.materia })}
        >
        <View style={styles.box2}>
          <Text style={styles.text}>{item.materia}</Text>
          <Ionicons name="chevron-forward" size={20} color={'#fff'} />
        </View>
      </TouchableOpacity>
      ))}


    </View>
    </ImageBackground>
    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

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
    gap: 40,
  },

  box: {
    width: '85%',
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'rgba(248, 250, 252, 0.14)',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  box2: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    width: '85%',
    height: 55,
    backgroundColor: 'rgba(248, 250, 252, 0.14)',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: '',
    fontSize: 20,
    marginRight: 70,
  },

})

export default PlanoDeAulaScreen;