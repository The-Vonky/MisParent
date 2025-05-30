import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // ou 'react-native-vector-icons/FontAwesome5'

export default function PerfilAlunoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cartão do Aluno */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Image
            source={{ uri: 'https://i.imgur.com/bPzB2rS.png' }}
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <ProfileItem label="Matrícula" value="00000001" />
            <ProfileItem label="Nome" value="Mordecai" />
            <ProfileItem label="Nascimento" value="07/07/1987" />
            <ProfileItem label="Escola" value="Mind International School - MIS" />
            <ProfileItem label="Observações" value="Gaio Azul" />
          </View>
        </View>
        <View style={styles.misLogoContainer}>
          <Text style={styles.misLogo}>MIS</Text>
        </View>
      </View>

      {/* Resumo de Tarefas */}
      <View style={styles.taskRow}>
        <TaskCard
          color="#4CAF50"
          icon="check-circle"
          title="Deveres feitos"
          count={12}
        />
        <TaskCard
          color="#F44336"
          icon="exclamation-circle"
          title="A fazer"
          count={2}
        />
      </View>
    </ScrollView>
  );
}

// COMPONENTES INTERNOS
const ProfileItem = ({ label, value }) => (
  <Text style={styles.label}>
    {label}: <Text style={styles.value}>{value}</Text>
  </Text>
);

const TaskCard = ({ color, icon, title, count }) => (
  <View style={[styles.taskCard, { backgroundColor: color }]}>
    <FontAwesome5 name={icon} size={24} color="#FFF" style={{ marginBottom: 10 }} />
    <Text style={styles.taskText}>{title}</Text>
    <Text style={styles.taskNumber}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F6FA',
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFA726',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 4,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
    fontSize: 14,
  },
  value: {
    fontWeight: '400',
    color: '#111',
  },
  misLogoContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  misLogo: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#003366',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  taskCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  taskText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskNumber: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
