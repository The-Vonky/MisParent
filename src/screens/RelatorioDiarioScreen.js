// src/screens/RelatorioDiarioScreen.js
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Relatório Diário</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Data do Relatório</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={styles.input}
          value={dataRelatorio}
          onChangeText={setDataRelatorio}
        />

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
              activeOpacity={0.7}
            >
              <Text style={styles.humorIcon}>{h.icon}</Text>
              <Text style={styles.humorLabel}>{h.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Higiene</Text>
        <View style={styles.checkboxRow}>
          <CheckBox value={coco} onValueChange={setCoco} tintColors={{ true: '#2563eb', false: '#ccc' }} />
          <Text style={styles.checkboxLabel}>Fez cocô</Text>
        </View>
        <View style={styles.checkboxRow}>
          <CheckBox value={xixi} onValueChange={setXixi} tintColors={{ true: '#2563eb', false: '#ccc' }} />
          <Text style={styles.checkboxLabel}>Fez xixi</Text>
        </View>

        <Text style={styles.sectionTitle}>Alimentação</Text>
        <View style={styles.checkboxRow}>
          <CheckBox
            value={alimentacao}
            onValueChange={setAlimentacao}
            tintColors={{ true: '#2563eb', false: '#ccc' }}
          />
          <Text style={styles.checkboxLabel}>Alimentou-se bem</Text>
        </View>

        <Text style={styles.sectionTitle}>Observações</Text>
        <TextInput
          placeholder="Escreva aqui..."
          multiline
          style={[styles.input, { minHeight: 100 }]}
          value={observacoes}
          onChangeText={setObservacoes}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Salvar Relatório</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#1e3a8a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  humorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  humorOption: {
    width: '30%',
    padding: 12,
    marginVertical: 6,
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
  },
  humorSelected: {
    backgroundColor: '#93c5fd',
  },
  humorIcon: {
    fontSize: 26,
  },
  humorLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: '#1e293b',
  },
  button: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
