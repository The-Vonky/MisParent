import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/AdminScreen';

export default function AuthGate() {
  const [loading, setLoading] = useState(true);
  const [component, setComponent] = useState(<LoginScreen />);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(firestore, 'Users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.role === 'admin') {
              setComponent(<AdminScreen />);
            } else {
              setComponent(<HomeScreen />);
            }
          } else {
            console.warn('Documento de usuário não encontrado.');
            setComponent(<LoginScreen />);
          }
        } catch (e) {
          console.error('Erro ao buscar role:', e);
          setComponent(<LoginScreen />);
        }
      } else {
        setComponent(<LoginScreen />);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00008B" />
      </View>
    );
  }

  return component;
}