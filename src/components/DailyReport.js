// src/components/DailyReport.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Button, ScrollView } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const DailyReport = ({ selectedDate }) => {
  const [isHappy, setIsHappy] = useState(false);
  const [didPoop, setDidPoop] = useState(false);
  const [didPee, setDidPee] = useState(false);
  const [isPottyTraining, setIsPottyTraining] = useState(false);
  const [ateLunch, setAteLunch] = useState(false);
  const [ateFruit, setAteFruit] = useState(false);
  const [participatedActivities, setParticipatedActivities] = useState(false);
  const [observation, setObservation] = useState('');

  const handleSubmit = async () => {
    const reportData = {
      date: selectedDate,
      isHappy,
      didPoop,
      didPee,
      isPottyTraining,
      ateLunch,
      ateFruit,
      participatedActivities,
      observation,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'dailyReports'), reportData);
      console.log('Relatório enviado:', reportData);
      alert('Relatório enviado com sucesso!');

      // Limpa os campos após enviar
      setIsHappy(false);
      setDidPoop(false);
      setDidPee(false);
      setIsPottyTraining(false);
      setAteLunch(false);
      setAteFruit(false);
      setParticipatedActivities(false);
      setObservation('');
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      alert('Erro ao enviar relatório. Tente novamente.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Relatório do Dia - {selectedDate}</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Estava feliz?</Text>
        <Switch value={isHappy} onValueChange={setIsHappy} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Fez cocô?</Text>
        <Switch value={didPoop} onValueChange={setDidPoop} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Fez xixi?</Text>
        <Switch value={didPee} onValueChange={setDidPee} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Está em desfralde?</Text>
        <Switch value={isPottyTraining} onValueChange={setIsPottyTraining} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Almoçou?</Text>
        <Switch value={ateLunch} onValueChange={setAteLunch} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Comeu fruta?</Text>
        <Switch value={ateFruit} onValueChange={setAteFruit} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Participou das atividades?</Text>
        <Switch value={participatedActivities} onValueChange={setParticipatedActivities} />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Observações:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Escreva algo importante sobre o dia da criança..."
          multiline
          value={observation}
          onChangeText={setObservation}
        />
      </View>

      <Button title="Enviar Relatório" onPress={handleSubmit} color="#1e3a8a" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1e3a8a',
    textAlign: 'center',
  },
  item: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 6,
  },
  textInput: {
    height: 100,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top',
  },
});

export default DailyReport;