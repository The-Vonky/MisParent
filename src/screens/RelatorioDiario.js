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
} from 'react-native';
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
        const querySnapshot = await getDocs(collection(firestore, 'Alunos'));
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Relatório Diário</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Data */}
        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          value={dataRelatorio}
          onChangeText={setDataRelatorio}
          placeholder="DD-MM-AAAA (deixe em branco para hoje)"
        />

        {/* Aluno */}
        <Text style={styles.label}>Aluno</Text>
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
        <Text style={styles.label}>Humor</Text>
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
        <Text style={styles.label}>Higiene</Text>
        <TouchableOpacity onPress={() => setCoco(!coco)} style={styles.checkboxOption}>
          <Text style={styles.checkboxText}>{coco ? '✅' : '⬜️'} Fez cocô</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setXixi(!xixi)} style={styles.checkboxOption}>
          <Text style={styles.checkboxText}>{xixi ? '✅' : '⬜️'} Fez xixi</Text>
        </TouchableOpacity>

        {/* Alimentação */}
        <Text style={styles.label}>Alimentação</Text>
        <TouchableOpacity onPress={() => setAlimentacao(!alimentacao)} style={styles.checkboxOption}>
          <Text style={styles.checkboxText}>{alimentacao ? '✅' : '⬜️'} Alimentou-se bem</Text>
        </TouchableOpacity>

        {/* Observações */}
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, { minHeight: 80 }]}
          multiline
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Escreva observações aqui..."
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar Relatório</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    paddingTop: 10,
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#1e3a8a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  humorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  humorOption: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  humorSelected: {
    backgroundColor: '#bfdbfe',
  },
  humorIcon: {
    fontSize: 26,
  },
  checkboxOption: {
    marginTop: 12,
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
