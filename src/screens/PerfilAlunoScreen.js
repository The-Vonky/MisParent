import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { firestore } from '../config/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function AdminGradeScreen({ navigation }) {
  const [materia, setMateria] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [professor, setProfessor] = useState('');
  const [sala, setSala] = useState('');
  const [conteudo, setConteudo] = useState('');

  const handleSalvar = async () => {
    if (!materia || !inicio || !fim || !professor || !sala || !conteudo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await addDoc(collection(firestore, 'GradeHorarios'), {
        materia,
        inicio,
        fim,
        professor,
        sala,
        conteudo,
        dataCriacao: Timestamp.now(),
      });

      Alert.alert('Sucesso', 'Horário cadastrado com sucesso!');
      setMateria('');
      setInicio('');
      setFim('');
      setProfessor('');
      setSala('');
      setConteudo('');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível salvar o horário.');
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Horário</Text>

      <TextInput
        placeholder="Matéria"
        style={styles.input}
        value={materia}
        onChangeText={setMateria}
      />
      <TextInput
        placeholder="Horário de Início (ex: 08:00)"
        style={styles.input}
        value={inicio}
        onChangeText={setInicio}
      />
      <TextInput
        placeholder="Horário de Término (ex: 09:00)"
        style={styles.input}
        value={fim}
        onChangeText={setFim}
      />
      <TextInput
        placeholder="Nome do Professor"
        style={styles.input}
        value={professor}
        onChangeText={setProfessor}
      />
      <TextInput
        placeholder="Sala"
        style={styles.input}
        value={sala}
        onChangeText={setSala}
      />
      <TextInput
        placeholder="Conteúdo"
        style={styles.input}
        value={conteudo}
        onChangeText={setConteudo}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Horário</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// COMPONENTES INTERNOS
const ProfileItem = ({ label, value }) => (
  <Text style={styles.label}>
    {label}: <Text style={styles.value}>{value}</Text>
  </Text>
);

const TaskCard = ({ color, icon, title, count }) => (
  <View style={[styles.taskCard, { backgroundColor: color }]}>
    <FontAwesome5 name={icon} size={24} color="#FFF" style={{ marginBottom: 10 }} />
    <Text style={styles.taskText}>{title}</Text>
    <Text style={styles.taskNumber}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#00008B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#00008B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});