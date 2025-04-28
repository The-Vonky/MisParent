import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen';
import { auth, firestore } from '../config/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { ActivityIndicator, View } from 'react-native'; // Novo

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Novo

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser; // Pega o usuário autenticado
      if (user) {
        const userDoc = doc(firestore, 'users', user.uid); // Acessa o documento do usuário no Firestore
        const userSnapshot = await getDoc(userDoc); // Pega os dados do documento
        if (userSnapshot.exists()) {
          setUserRole(userSnapshot.data().role); // Armazena o papel do usuário (admin ou pai)
        }
      }
      setLoading(false); // Atualiza o estado de carregamento após verificar o papel
    };

    checkUserRole();
  }, []);

  // Se estiver carregando, exibe o ActivityIndicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Tela de Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        {/* Condicionalmente exibe a tela correta */}
        {userRole === 'admin' ? (
          <Stack.Screen
            name="AdminScreen"
            component={AdminScreen}
          />
        ) : (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
