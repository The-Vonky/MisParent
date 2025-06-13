import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen';
import AlertasScreen from '../screens/AlertasScreen';
import CadastrarAlunoScreen from '../screens/CadastrarAlunoScreen';
import SettingsScreen from '../screens/SettingsScreens';
import RelatorioDiarioScreen from '../screens/RelatorioDiario';
import PlanoAulaScreen from '../screens/PlanoAulaScreen';
import PlanoDeAulaScreen from '../screens/PlanoDeAulaScreen';
import PlanoDeAulaDetalhadoScreen from '../screens/PlanoDeAulaDetalhadoScreen';
import PerfilAlunoScreen from '../screens/PerfilAlunoScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Messages"
            component={MessagesScreen}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
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

          <Stack.Screen
            name="PlanoAula"
            component={PlanoAulaScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PlanoDeAula"
            component={PlanoDeAulaScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PlanoDeAulaDetalhado"
            component={PlanoDeAulaDetalhadoScreen}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
    </SafeAreaView>
  );
}