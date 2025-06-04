import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function AdminScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Painel do Administrador</Text>
      </View>

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.content}>
        <Card
          title="Plano de Aula"
          icon="calendar"
          onPress={() => navigation.navigate('PlanoAula')}
        />
        <Card
          title="Relatório diário"
          icon="file-text"
          onPress={() => navigation.navigate('RelatorioDiario')}
        />
        <Card
          title="Alertas / Recados"
          icon="bell"
          onPress={() => navigation.navigate('Alertas')}
        />
        <Card
          title="Mensagens"
          icon="message-circle"
          onPress={() => navigation.navigate('Messages')}
        />
        <Card
          title="Cadastrar Aluno"
          icon="user"
          onPress={() => navigation.navigate('CadastrarAluno')}
        />
        <Card
          title="Configurações"
          icon="settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </ScrollView>
    </View>
  );
}

function Card({ title, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Icon name={icon} size={24} color="#1e3a8a" style={styles.icon} />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
  },
});