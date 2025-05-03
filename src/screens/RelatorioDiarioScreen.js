// src/screens/RelatorioDiarioScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
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
  const [listaAlunos, setListaAlunos] = useState([]);
  const [dataRelatorio, setDataRelatorio] = useState('');
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [coco, setCoco] = useState(false);
  const [xixi, setXixi] = useState(false);
  const [alimentacao, setAlimentacao] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'alunos'));
        const alunos = [];
        querySnapshot.forEach((doc) => {
          alunos.push({ id: doc.id, ...doc.data() });
        });
        setListaAlunos(alunos);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    }
    carregarAlunos();
  }, []);

  const handleSubmit = async () => {
    if (!alunoSelecionado || !humorSelecionado) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const data = dataRelatorio || new Date().toISOString().split('T')[0];

    const relatorio = {
      alunoId: alunoSelecionado,
      data,
      humor: humorSelecionado,
      coco,
      xixi,
      alimentacao,
      observacoes,
    };

    try {
      await addDoc(collection(firestore, 'relatorios'), relatorio);
      Alert.alert('Sucesso', 'Relatório salvo com sucesso!');
      // Limpa os campos
      setHumorSelecionado(null);
      setCoco(false);
      setXixi(false);
      setAlimentacao(false);
      setObservacoes('');
      setDataRelatorio('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o relatório.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6fa' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Relatório Diário</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Data */}
        <Text style={styles.sectionTitle}>Data do Relatório</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={styles.input}
          value={dataRelatorio}
          onChangeText={setDataRelatorio}
        />

        {/* Seleção de Aluno */}
        <Text style={styles.sectionTitle}>Aluno</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={alunoSelecionado}
            onValueChange={(itemValue) => setAlunoSelecionado(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um aluno" value="" />
            {listaAlunos.map((aluno) => (
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
          <Text style={styles.checkboxLabel}>Fez cocô</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox value={xixi} onValueChange={setXixi} tintColors={{ true: '#1e3a8a', false: '#ccc' }} />
          <Text style={styles.checkboxLabel}>Fez xixi</Text>
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
    minHeight: 50,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});