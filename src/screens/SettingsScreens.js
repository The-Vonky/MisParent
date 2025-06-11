import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Configurações</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Conta */}
        <Text style={styles.sectionTitle}>Conta</Text>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons name="person-outline" size={24} color="black" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.optionTitle}>Informações pessoais</Text>
              <Text style={styles.optionSubtitle}>Nome, e-mail, telefone</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <Feather name="lock" size={24} color="black" />
            <Text style={[styles.optionTitle, { marginLeft: 10 }]}>Mudar senha</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>

        {/* Notificações */}
        <Text style={styles.sectionTitle}>Notificações</Text>

        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons name="notifications-outline" size={24} color="black" />
            <Text style={[styles.optionTitle, { marginLeft: 10 }]}>Notificações push</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
        </View>

        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <Feather name="mail" size={24} color="black" />
            <Text style={[styles.optionTitle, { marginLeft: 10 }]}>Notificações por e-mail</Text>
          </View>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
        </View>

        {/* Sobre */}
        <Text style={styles.sectionTitle}>Sobre</Text>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <Feather name="file-text" size={24} color="black" />
            <Text style={[styles.optionTitle, { marginLeft: 10 }]}>Termos de serviço</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <MaterialIcons name="privacy-tip" size={24} color="black" />
            <Text style={[styles.optionTitle, { marginLeft: 10 }]}>Política de privacidade</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>

        <View style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text style={[styles.optionTitle, { marginLeft: 10 }]}>Versão do aplicativo</Text>
          </View>
          <Text style={{ color: 'gray', fontSize: 14 }}>1.0.0</Text>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  logoutButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});