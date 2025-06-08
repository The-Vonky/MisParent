import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
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

  const handleSalvar = async () => {
    if (
      !nomeAula || !materia || !professor || !turma ||
      !conteudo || !objetivos || !metodos || !recursos || !avaliacao
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

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
      });

      Alert.alert('Sucesso', 'Plano de aula salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o plano de aula.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Plano de Aula</Text>
          <View style={{ width: 24 }} /> {/* espaço pra equilibrar */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Nome da aula"
          style={styles.input}
          value={nomeAula}
          onChangeText={setNomeAula}
        />
        <TextInput
          placeholder="Matéria"
          style={styles.input}
          value={materia}
          onChangeText={setMateria}
        />
        <TextInput
          placeholder="Professor"
          style={styles.input}
          value={professor}
          onChangeText={setProfessor}
        />
        <TextInput
          placeholder="Turma"
          style={styles.input}
          value={turma}
          onChangeText={setTurma}
        />
        <TextInput
          placeholder="Conteúdo"
          style={styles.textArea}
          value={conteudo}
          onChangeText={setConteudo}
          multiline
        />
        <TextInput
          placeholder="Objetivos"
          style={styles.textArea}
          value={objetivos}
          onChangeText={setObjetivos}
          multiline
        />
        <TextInput
          placeholder="Métodos de ensino"
          style={styles.textArea}
          value={metodos}
          onChangeText={setMetodos}
          multiline
        />
        <TextInput
          placeholder="Recursos"
          style={styles.textArea}
          value={recursos}
          onChangeText={setRecursos}
          multiline
        />
        <TextInput
          placeholder="Avaliação"
          style={styles.textArea}
          value={avaliacao}
          onChangeText={setAvaliacao}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>Salvar</Text>
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
    backgroundColor: '#1e3a8a',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    textAlignVertical: 'top',
    height: 100,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
