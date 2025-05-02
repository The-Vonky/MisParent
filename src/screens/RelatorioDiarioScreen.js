// src/screens/RelatorioDiarioScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { firestore } from '../config/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const humores = [
  { label: 'Muito Feliz', icon: '😄' },
  { label: 'Feliz', icon: '🙂' },
  { label: 'Neutro', icon: '😐' },
  { label: 'Triste', icon: '🙁' },
  { label: 'Muito Triste', icon: '😢' },
];

export default function RelatorioDiarioScreen() {
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [coco, setCoco] = useState(null);
  const [xixi, setXixi] = useState(null);
  const [alimentacao, setAlimentacao] = useState(null);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    async function carregarAlunos() {
      const snapshot = await getDocs(collection(firestore, 'alunos'));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setAlunos(lista);
    }
    carregarAlunos();
  }, []);

  const handleSubmit = async () => {
    if (!alunoSelecionado || !humorSelecionado || coco === null || xixi === null || alimentacao === null) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const dataAtual = new Date().toISOString().split('T')[0];

    await addDoc(collection(firestore, 'relatorios'), {
      alunoId: alunoSelecionado,
      data: dataAtual,
      humor: humorSelecionado,
      coco,
      xixi,
      alimentacao,
      observacoes,
    });

    alert('Relatório salvo com sucesso!');
    // Limpar estados
    setHumorSelecionado(null);
    setCoco(null);
    setXixi(null);
    setAlimentacao(null);
    setObservacoes('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6fa' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Relatório Diário</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Selecionar aluno */}
        <Text style={styles.sectionTitle}>Selecione o Aluno</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={alunoSelecionado}
            onValueChange={itemValue => setAlunoSelecionado(itemValue)}
          >
            <Picker.Item label="Selecione um aluno..." value="" />
            {alunos.map(aluno => (
              <Picker.Item key={aluno.id} label={aluno.nome} value={aluno.id} />
            ))}
          </Picker>
        </View>

        {/* Humor */}
        <Text style={styles.sectionTitle}>Humor</Text>
        <View style={styles.humorContainer}>
          {humores.map((h, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.humorOption, humorSelecionado === h.label && styles.humorSelected]}
              onPress={() => setHumorSelecionado(h.label)}
            >
              <Text style={styles.humorIcon}>{h.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Higiene */}
        <Text style={styles.sectionTitle}>Higiene</Text>
        <View style={styles.checkboxGroup}>
          <CheckRow label="Cocô" value={coco} setValue={setCoco} />
          <CheckRow label="Xixi" value={xixi} setValue={setXixi} />
        </View>

        {/* Alimentação */}
        <Text style={styles.sectionTitle}>Alimentação</Text>
        <CheckRow label="Alimentou-se bem" value={alimentacao} setValue={setAlimentacao} />

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

function CheckRow({ label, value, setValue }) {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={styles.radio}
        onPress={() => setValue(true)}
      >
        <View style={[styles.radioCircle, value === true && styles.radioSelected]} />
        <Text style={styles.checkboxLabel}>Sim</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.radio}
        onPress={() => setValue(false)}
      >
        <View style={[styles.radioCircle, value === false && styles.radioSelected]} />
        <Text style={styles.checkboxLabel}>Não</Text>
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
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
  checkboxGroup: {
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    marginHorizontal: 8,
    color: '#1e3a8a',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    marginRight: 4,
  },
  radioSelected: {
    backgroundColor: '#1e3a8a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
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
