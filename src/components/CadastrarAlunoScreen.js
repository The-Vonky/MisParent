import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CadastrarAlunoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [professora, setProfessora] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !turma || !modalidade || !professora) {
      Alert.alert('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await addDoc(collection(db, 'Students'), {
        nome,
        turma,
        modalidade,
        professora,
        fotoUrl: fotoUrl || null,
        criadoEm: new Date(),
      });

      Alert.alert('Aluno cadastrado com sucesso!');
      setNome('');
      setTurma('');
      setModalidade('');
      setProfessora('');
      setFotoUrl('');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao cadastrar aluno', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Aluno</Text>

      <TextInput placeholder="Nome completo" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Turma" style={styles.input} value={turma} onChangeText={setTurma} />
      <TextInput placeholder="Modalidade (Integral/Parcial)" style={styles.input} value={modalidade} onChangeText={setModalidade} />
      <TextInput placeholder="Professora responsável" style={styles.input} value={professora} onChangeText={setProfessora} />
      <TextInput placeholder="URL da Foto (opcional)" style={styles.input} value={fotoUrl} onChangeText={setFotoUrl} />

      <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
