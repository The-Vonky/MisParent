import React from 'react';
import { View, Text, Button } from 'react-native';
import { firebase } from '../config/firebaseConfig';


const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    firebase.auth().signOut();
    navigation.replace('Login');
  };

  return (
    <View>
      <Text>Bem-vindo à Home!</Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};


export default HomeScreen;