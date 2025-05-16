import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, firestore } from './src/config/firebaseConfig';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialScreen, setInitialScreen] = useState('Login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'Users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
              setInitialScreen('HomeAdm'); // Corrigido
            } else {
              setInitialScreen('HomePai'); // Corrigido
            }
          } else {
            setInitialScreen('Login');
          }
        } catch (error) {
          console.error('Erro ao buscar o role:', error);
          setInitialScreen('Login');
        }
      } else {
        setInitialScreen('Login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00008B" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator initialScreen={initialScreen} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
