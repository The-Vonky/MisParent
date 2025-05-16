import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen';
import CadastrarAlunoScreen from '../screens/CadastrarAlunoScreen';
import RelatorioDiarioScreen from '../screens/RelatorioDiarioScreen';
import AlertasScreen from '../screens/AlertasScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator({ initialScreen }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName={initialScreen}>
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
          name="RelatorioDiario"
          component={RelatorioDiarioScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CadastrarAluno"
          component={CadastrarAlunoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
