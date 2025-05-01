// src/screens/RelatorioDiarioScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CheckBox from '@react-native-community/checkbox';

const humores = [
  { label: 'Muito Feliz', icon: '😄' },
  { label: 'Feliz', icon: '🙂' },
  { label: 'Neutro', icon: '😐' },
  { label: 'Triste', icon: '🙁' },
  { label: 'Muito Triste', icon: '😢' },
];

export default function RelatorioDiarioScreen() {
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [coco, setCoco] = useState(false);
  const [xixi, setXixi] = useState(false);
  const [alimentacao, setAlimentacao] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  const handleSubmit = () => {
    // lógica para salvar no Firebase
    console.log({ humorSelecionado, coco, xixi, alimentacao, observacoes });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6fa' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Relatório Diário</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Humor */}
        <Text style={styles.sectionTitle}>Humor</Text>
        <View style={styles.humorContainer}>
          {humores.map((h, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.humorOption,
                humorSelecionado === h.label && styles.humorSelected,
              ]}
              onPress={() => setHumorSelecionado(h.label)}
            >
              <Text style={styles.humorIcon}>{h.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Higiene */}
        <Text style={styles.sectionTitle}>Higiene</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox value={coco} onValueChange={setCoco} tintColors={{ true: '#1e3a8a', false: '#ccc' }} />
          <Text style={styles.checkboxLabel}>Cocô</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox value={xixi} onValueChange={setXixi} tintColors={{ true: '#1e3a8a', false: '#ccc' }} />
          <Text style={styles.checkboxLabel}>Xixi</Text>
        </View>

        {/* Alimentação */}
        <Text style={styles.sectionTitle}>Alimentação</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={alimentacao}
            onValueChange={setAlimentacao}
            tintColors={{ true: '#1e3a8a', false: '#ccc' }}
          />
          <Text style={styles.checkboxLabel}>Alimentou-se bem</Text>
        </View>

        {/* Observações */}
        <Text style={styles.sectionTitle}>Observações</Text>
        <TextInput
          placeholder="Escreva aqui..."
          multiline
          style={styles.input}
          value={observacoes}
          onChangeText={setObservacoes}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar Relatório</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1e3a8a',
  },
  humorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  humorOption: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
  },
  humorSelected: {
    backgroundColor: '#bfdbfe',
  },
  humorIcon: {
    fontSize: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
