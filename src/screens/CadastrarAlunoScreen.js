import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function CadastrarAlunoScreen() {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [idade, setIdade] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !turma || !idade) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    try {
      await addDoc(collection(db, 'Alunos'), {
        nome,
        turma,
        idade: parseInt(idade),
        criadoEm: new Date()
      });
      Alert.alert('Aluno cadastrado com sucesso!');
      setNome('');
      setTurma('');
      setIdade('');
    } catch (err) {
      Alert.alert('Erro ao cadastrar aluno');
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Aluno</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Turma</Text>
      <TextInput
        style={styles.input}
        value={turma}
        onChangeText={setTurma}
        placeholder="Ex: Maternal I"
      />

      <Text style={styles.label}>Idade</Text>
      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        placeholder="Ex: 4"
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#00008B',
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});