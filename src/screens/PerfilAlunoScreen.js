import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function PerfilAlunoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cartão do Aluno */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Image
            source={{ uri: 'https://i.imgur.com/bPzB2rS.png' }} // substitua pela imagem real do aluno
            style={styles.profileImage}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nº de Matrícula: <Text style={styles.value}>00000001</Text></Text>
            <Text style={styles.label}>Nome do Estudante: <Text style={styles.value}>Mordecai</Text></Text>
            <Text style={styles.label}>Data de Nascimento: <Text style={styles.value}>07/07/1987</Text></Text>
            <Text style={styles.label}>Escola: <Text style={styles.value}>Mind International School - MIS</Text></Text>
            <Text style={styles.label}>Observações: <Text style={styles.value}>Gaio Azul</Text></Text>
          </View>
        </View>
        <View style={styles.misLogoContainer}>
          <Text style={styles.misLogo}>MIS</Text>
        </View>
      </View>

      {/* Resumo de Tarefas */}
      <View style={[styles.taskCard, { backgroundColor: '#6A7FFF' }]}>
        <Text style={styles.taskText}>Deveres de Casa Feitos:</Text>
        <Text style={styles.taskNumber}>12</Text>
      </View>

      <View style={[styles.taskCard, { backgroundColor: '#FF3B3B' }]}>
        <Text style={styles.taskText}>Deveres de Casa a fazer:</Text>
        <Text style={styles.taskNumber}>2</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FF8C32',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    elevation: 3,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  value: {
    fontWeight: 'normal',
  },
  misLogoContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  misLogo: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00008B',
  },
  taskCard: {
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  taskText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  taskNumber: {
    color: '#FFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
