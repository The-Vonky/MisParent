import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../config/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function PlanoDeAulaScreen({ navigation }) {
  const [nomeAula, setNomeAula] = useState('');
  const [materia, setMateria] = useState('');
  const [professor, setProfessor] = useState('');
  const [turma, setTurma] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [objetivos, setObjetivos] = useState('');
  const [metodos, setMetodos] = useState('');
  const [recursos, setRecursos] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (
      !nomeAula ||
      !materia ||
      !professor ||
      !turma ||
      !conteudo ||
      !objetivos ||
      !metodos ||
      !recursos ||
      !avaliacao
    ) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos para continuar.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(firestore, 'PlanosDeAula'), {
        nomeAula,
        materia,
        professor,
        turma,
        conteudo,
        objetivos,
        metodos,
        recursos,
        avaliacao,
        dataCriacao: Timestamp.now(),
        status: 'ativo',
      });

      Alert.alert(
        'Sucesso!', 
        'Plano de aula salvo com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar plano de aula:', error);
      Alert.alert('Erro', 'Não foi possível salvar o plano de aula. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    Alert.alert(
      'Limpar formulário',
      'Tem certeza que deseja limpar todos os campos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            setNomeAula('');
            setMateria('');
            setProfessor('');
            setTurma('');
            setConteudo('');
            setObjetivos('');
            setMetodos('');
            setRecursos('');
            setAvaliacao('');
          }
        }
      ]
    );
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
        <Text style={styles.headerText}>Plano de Aula</Text>
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
        {/* Seção: Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome da Aula *</Text>
            <TextInput
              placeholder="Ex: Matemática Básica - Adição"
              style={styles.input}
              value={nomeAula}
              onChangeText={setNomeAula}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Matéria *</Text>
              <TextInput
                placeholder="Ex: Matemática"
                style={styles.input}
                value={materia}
                onChangeText={setMateria}
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Turma *</Text>
              <TextInput
                placeholder="Ex: Pré I-A"
                style={styles.input}
                value={turma}
                onChangeText={setTurma}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Professor *</Text>
            <TextInput
              placeholder="Nome do professor responsável"
              style={styles.input}
              value={professor}
              onChangeText={setProfessor}
            />
          </View>
        </View>

        {/* Seção: Planejamento Pedagógico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planejamento Pedagógico</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Conteúdo *</Text>
            <TextInput
              placeholder="Descreva o conteúdo que será abordado na aula..."
              style={styles.textArea}
              value={conteudo}
              onChangeText={setConteudo}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Objetivos *</Text>
            <TextInput
              placeholder="Quais são os objetivos de aprendizagem desta aula?"
              style={styles.textArea}
              value={objetivos}
              onChangeText={setObjetivos}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Métodos de Ensino *</Text>
            <TextInput
              placeholder="Como o conteúdo será apresentado? (jogos, brincadeiras, etc.)"
              style={styles.textArea}
              value={metodos}
              onChangeText={setMetodos}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Seção: Recursos e Avaliação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos e Avaliação</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Recursos Necessários *</Text>
            <TextInput
              placeholder="Liste os materiais, brinquedos e recursos necessários..."
              style={styles.textArea}
              value={recursos}
              onChangeText={setRecursos}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Avaliação *</Text>
            <TextInput
              placeholder="Como será avaliado o aprendizado das crianças?"
              style={styles.textArea}
              value={avaliacao}
              onChangeText={setAvaliacao}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Botão de salvar */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Salvar Plano de Aula</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 15,
  },
  halfWidth: {
    width: '48%',
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