import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';

import LoadingScreen from '../screens/LoadingScreen'; 
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen';
import AlertasScreen from '../screens/AlertasScreen';
import MessagesScreen from '../screens/Messages.Screen';
import CadastrarAlunoScreen from '../screens/CadastrarAlunoScreen';
import SettingsScreen from '../screens/SettingsScreens';
import RelatorioDiarioScreen from '../screens/RelatorioDiario';
import PerfilAlunoScreen from '../screens/PerfilAlunoScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Alertas"
          component={AlertasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RelatorioDiario"
          component={RelatorioDiarioScreen}
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
        <Stack.Screen
          name="PerfilAluno"
          component={PerfilAlunoScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
