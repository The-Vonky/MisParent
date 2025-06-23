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
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { firestore } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

const humores = [
  { label: 'Muito Feliz', icon: '😄', color: '#22c55e' },
  { label: 'Feliz', icon: '🙂', color: '#84cc16' },
  { label: 'Neutro', icon: '😐', color: '#6b7280' },
  { label: 'Triste', icon: '🙁', color: '#f59e0b' },
  { label: 'Muito Triste', icon: '😢', color: '#ef4444' },
];

export default function RelatorioDiarioScreen({ navigation }) {
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [alunoInfo, setAlunoInfo] = useState(null);
  const [listaAlunos, setListaAlunos] = useState([]);
  const [dataRelatorio, setDataRelatorio] = useState('');
  const [humorSelecionado, setHumorSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados básicos originais
  const [coco, setCoco] = useState(false);
  const [xixi, setXixi] = useState(false);
  const [alimentacao, setAlimentacao] = useState(false);
  
  // Novos estados baseados na proposta da cliente
  const [comeuFruta, setComeuFruta] = useState(false);
  const [participouAtividades, setParticipouAtividades] = useState(false);
  const [processoDesfralde, setProcessoDesfralde] = useState(false);
  const [dormiu, setDormiu] = useState(false);
  const [brincou, setBrincou] = useState(false);
  
  // Estados para alertas de materiais
  const [faltaFraldas, setFaltaFraldas] = useState(false);
  const [faltaPastaDente, setFaltaPastaDente] = useState(false);
  const [faltaOutroMaterial, setFaltaOutroMaterial] = useState('');
  
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
        Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
      }
    }
    carregarAlunos();
  }, []);

  useEffect(() => {
    if (alunoSelecionado) {
      const aluno = listaAlunos.find(a => a.id === alunoSelecionado);
      setAlunoInfo(aluno);
    } else {
      setAlunoInfo(null);
    }
  }, [alunoSelecionado, listaAlunos]);

  const handleSubmit = async () => {
    if (!alunoSelecionado || !humorSelecionado) {
      Alert.alert('Campos obrigatórios', 'Por favor, selecione um aluno e indique o humor.');
      return;
    }

    const hoje = new Date();
    const dataFormatada = dataRelatorio || 
      `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;

    const relatorio = {
      alunoId: alunoSelecionado,
      alunoNome: alunoInfo?.nome || 'Aluno',
      data: dataFormatada,
      timestamp: Timestamp.now(),
      
      // Humor e bem-estar
      humor: humorSelecionado,
      
      // Higiene e cuidados
      coco,
      xixi,
      processoDesfralde,
      
      // Alimentação
      alimentacao,
      comeuFruta,
      
      // Atividades e desenvolvimento
      participouAtividades,
      dormiu,
      brincou,
      
      // Alertas de materiais
      alertas: {
        faltaFraldas,
        faltaPastaDente,
        outroMaterial: faltaOutroMaterial || null,
      },
      
      // Observações gerais
      observacoes,
      
      // Metadados
      criadoEm: Timestamp.now(),
      status: 'ativo',
    };

    setLoading(true);
    try {
      await addDoc(collection(firestore, 'relatorios'), relatorio);
      
      Alert.alert(
        'Sucesso!', 
        `Relatório de ${alunoInfo?.nome} salvo com sucesso!`,
        [
          {
            text: 'Novo Relatório',
            onPress: () => limparFormulario()
          },
          {
            text: 'Voltar',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      Alert.alert('Erro', 'Não foi possível salvar o relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setHumorSelecionado(null);
    setCoco(false);
    setXixi(false);
    setAlimentacao(false);
    setComeuFruta(false);
    setParticipouAtividades(false);
    setProcessoDesfralde(false);
    setDormiu(false);
    setBrincou(false);
    setFaltaFraldas(false);
    setFaltaPastaDente(false);
    setFaltaOutroMaterial('');
    setObservacoes('');
    setDataRelatorio('');
    setAlunoSelecionado('');
  };

  const getDataFormatada = () => {
    const hoje = new Date();
    return `${hoje.getDate().toString().padStart(2, '0')}/${(hoje.getMonth() + 1).toString().padStart(2, '0')}/${hoje.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header padronizado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Relatório Diário</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={limparFormulario}
        >
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Seção: Identificação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Data do Relatório</Text>
            <TextInput
              style={styles.input}
              value={dataRelatorio}
              onChangeText={setDataRelatorio}
              placeholder={`Hoje: ${getDataFormatada()}`}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Aluno *</Text>
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
          </View>

          {/* Info do aluno selecionado */}
          {alunoInfo && (
            <View style={styles.alunoInfoCard}>
              <View style={styles.alunoInfoHeader}>
                {alunoInfo.imagemUri ? (
                  <Image source={{ uri: alunoInfo.imagemUri }} style={styles.alunoPhoto} />
                ) : (
                  <View style={styles.alunoPhotoPlaceholder}>
                    <Ionicons name="person" size={24} color="#1e3a8a" />
                  </View>
                )}
                <View style={styles.alunoDetails}>
                  <Text style={styles.alunoNome}>{alunoInfo.nome}</Text>
                  <Text style={styles.alunoInfo}>Turma: {alunoInfo.turma || 'Não informado'}</Text>
                  <Text style={styles.alunoInfo}>Modalidade: {alunoInfo.modalidade || 'Não informado'}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Seção: Humor e Bem-estar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como a criança estava hoje?</Text>
          <View style={styles.humorContainer}>
            {humores.map((h, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.humorOption,
                  humorSelecionado === h.label && { 
                    backgroundColor: h.color + '20',
                    borderColor: h.color,
                    borderWidth: 2
                  },
                ]}
                onPress={() => setHumorSelecionado(h.label)}
              >
                <Text style={styles.humorIcon}>{h.icon}</Text>
                <Text style={styles.humorLabel}>{h.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seção: Higiene e Cuidados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Higiene e Cuidados</Text>
          
          <TouchableOpacity onPress={() => setCoco(!coco)} style={styles.checkboxOption}>
            <Ionicons 
              name={coco ? "checkbox" : "square-outline"} 
              size={24} 
              color={coco ? "#22c55e" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Fez cocô</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setXixi(!xixi)} style={styles.checkboxOption}>
            <Ionicons 
              name={xixi ? "checkbox" : "square-outline"} 
              size={24} 
              color={xixi ? "#22c55e" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Fez xixi</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setProcessoDesfralde(!processoDesfralde)} style={styles.checkboxOption}>
            <Ionicons 
              name={processoDesfralde ? "checkbox" : "square-outline"} 
              size={24} 
              color={processoDesfralde ? "#f59e0b" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Em processo de desfralde</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Alimentação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alimentação</Text>
          
          <TouchableOpacity onPress={() => setAlimentacao(!alimentacao)} style={styles.checkboxOption}>
            <Ionicons 
              name={alimentacao ? "checkbox" : "square-outline"} 
              size={24} 
              color={alimentacao ? "#22c55e" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Almoçou bem</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setComeuFruta(!comeuFruta)} style={styles.checkboxOption}>
            <Ionicons 
              name={comeuFruta ? "checkbox" : "square-outline"} 
              size={24} 
              color={comeuFruta ? "#22c55e" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Comeu fruta</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Atividades e Desenvolvimento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades e Desenvolvimento</Text>
          
          <TouchableOpacity onPress={() => setParticipouAtividades(!participouAtividades)} style={styles.checkboxOption}>
            <Ionicons 
              name={participouAtividades ? "checkbox" : "square-outline"} 
              size={24} 
              color={participouAtividades ? "#22c55e" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Participou das atividades</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setDormiu(!dormiu)} style={styles.checkboxOption}>
            <Ionicons 
              name={dormiu ? "checkbox" : "square-outline"} 
              size={24} 
              color={dormiu ? "#22c55e" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Dormiu durante o descanso</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setBrincou(!brincou)} style={styles.checkboxOption}>
            <Ionicons 
              name={brincou ? "checkbox" : "square-outline"} 
              size={24} 
              color={brincou ? "#22c55e" : "#9ca3af"} 
            />
            <Text style={styles.checkboxText}>Brincou e interagiu bem</Text>
          </TouchableOpacity>
        </View>

        {/* Seção: Alertas de Materiais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas de Materiais</Text>
          
          <TouchableOpacity onPress={() => setFaltaFraldas(!faltaFraldas)} style={styles.checkboxOption}>
            <Ionicons 
              name={faltaFraldas ? "checkbox" : "square-outline"} 
              size={24} 
              color={faltaFraldas ? "#ef4444" : "#9ca3af"} 
            />
            <Text style={[styles.checkboxText, faltaFraldas && { color: '#ef4444' }]}>
              Falta fraldas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFaltaPastaDente(!faltaPastaDente)} style={styles.checkboxOption}>
            <Ionicons 
              name={faltaPastaDente ? "checkbox" : "square-outline"} 
              size={24} 
              color={faltaPastaDente ? "#ef4444" : "#9ca3af"} 
            />
            <Text style={[styles.checkboxText, faltaPastaDente && { color: '#ef4444' }]}>
              Falta pasta de dente
            </Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Outro material em falta</Text>
            <TextInput
              style={styles.input}
              value={faltaOutroMaterial}
              onChangeText={setFaltaOutroMaterial}
              placeholder="Ex: lenços, pomada, etc."
            />
          </View>
        </View>

        {/* Seção: Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações Gerais</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Escreva observações sobre o dia da criança, comportamento, marcos de desenvolvimento, etc."
            textAlignVertical="top"
          />
        </View>

        {/* Botão de salvar */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Salvar Relatório</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 5,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
    paddingLeft: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  alunoInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 10,
  },
  alunoInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alunoPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  alunoPhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alunoDetails: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  alunoInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 1,
  },
  humorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  humorOption: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '18%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  humorIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  humorLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6b7280',
    fontWeight: '500',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  checkboxText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});