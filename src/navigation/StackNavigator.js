import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen';
import AlertasScreen from '../screens/AlertasScreen';
import MessagesScreen from '../screens/Messages.Screen';
import CadastrarAlunoScreen from '../screens/CadastrarAlunoScreen';
import SettingsScreen from '../screens/SettingsScreens';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="AuthLoading">
        
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePai"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeAdm"
          component={AdminScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CadastrarAluno"
          component={CadastrarAlunoScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}