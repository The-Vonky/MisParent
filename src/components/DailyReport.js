// src/components/DailyReport.js
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet } from 'react-native';

const DailyReport = ({ selectedDate, onSave }) => {
  const [isHappy, setIsHappy] = useState(false);
  const [didCoco, setDidCoco] = useState(false);
  const [didXixi, setDidXixi] = useState(false);
  const [isPottyTraining, setIsPottyTraining] = useState(false);
  const [ateLunch, setAteLunch] = useState(false);
  const [ateFruit, setAteFruit] = useState(false);
  const [participatedActivities, setParticipatedActivities] = useState(false);
  const [observations, setObservations] = useState('');

  const handleSave = () => {
    const reportData = {
      date: selectedDate,
      isHappy,
      didCoco,
      didXixi,
      isPottyTraining,
      ateLunch,
      ateFruit,
      participatedActivities,
      observations,
    };

    // Aqui, você pode salvar os dados localmente ou no Firebase
    onSave(reportData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Resumo do Dia</Text>

      <View style={styles.switchRow}>
        <Text>Estava feliz?</Text>
        <Switch value={isHappy} onValueChange={setIsHappy} />
      </View>

      <View style={styles.switchRow}>
        <Text>Fez cocô?</Text>
        <Switch value={didCoco} onValueChange={setDidCoco} />
      </View>

      <View style={styles.switchRow}>
        <Text>Fez xixi?</Text>
        <Switch value={didXixi} onValueChange={setDidXixi} />
      </View>

      <View style={styles.switchRow}>
        <Text>Está desfraldando?</Text>
        <Switch value={isPottyTraining} onValueChange={setIsPottyTraining} />
      </View>

      <View style={styles.switchRow}>
        <Text>Almoçou?</Text>
        <Switch value={ateLunch} onValueChange={setAteLunch} />
      </View>

      <View style={styles.switchRow}>
        <Text>Comeu fruta?</Text>
        <Switch value={ateFruit} onValueChange={setAteFruit} />
      </View>

      <View style={styles.switchRow}>
        <Text>Participou das atividades?</Text>
        <Switch value={participatedActivities} onValueChange={setParticipatedActivities} />
      </View>

      <TextInput
        style={styles.textArea}
        placeholder="Observações"
        multiline
        value={observations}
        onChangeText={setObservations}
      />

      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
  },
});

export default DailyReport;
