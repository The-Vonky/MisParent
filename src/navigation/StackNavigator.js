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
import MessagesScreen from '../screens/Messages.Screen';
import ChatScreen from '../screens/ChatScreen';
import AcessarDiarioScreen from '../screens/AcessarDiarioScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import GradeHorarioScreen from '../screens/GradeHorarioScreen';
import AtividadesScreen from '../screens/AtividadesScreen';
import FrequenciaScreen from '../screens/FrequenciaScreen';
import SecretariaScreen from '../screens/SecretariaScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="AcessarDiario"
            component={AcessarDiarioScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Secretaria"
            component={SecretariaScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Frequencia"
            component={FrequenciaScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Atividades"
            component={AtividadesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GradeHorario"
            component={GradeHorarioScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Materials"
            component={MaterialsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Messages"
            component={MessagesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
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