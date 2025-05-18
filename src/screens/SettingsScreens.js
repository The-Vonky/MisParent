import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function SettingsScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  const showComingSoon = () => {
    Alert.alert('Em breve', 'Essa funcionalidade ainda será implementada.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.option} onPress={showComingSoon}>
          <Text style={styles.optionText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={showComingSoon}>
          <Text style={styles.optionText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={showComingSoon}>
          <Text style={styles.optionText}>Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={showComingSoon}>
          <Text style={styles.optionText}>Tema</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={showComingSoon}>
          <Text style={styles.optionText}>Idioma</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={showComingSoon}>
          <Text style={styles.optionText}>Privacidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={showComingSoon}>
          <Text style={styles.optionText}>Ajuda e Suporte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Text style={[styles.optionText, { color: '#dc2626' }]}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  container: {
    padding: 20,
  },
  option: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 14,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
  },
});
