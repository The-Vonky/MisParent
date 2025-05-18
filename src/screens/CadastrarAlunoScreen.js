import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, SafeAreaView, ScrollView, Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

import { auth, firestore } from '../config/firebaseConfig';

export default function CadastrarAlunoScreen() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [responsaveis, setResponsaveis] = useState('');
  const [turma, setTurma] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [imagemUri, setImagemUri] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('Responsável');

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const handleCadastrar = async () => {
    if (!nome || !idade || !responsaveis || !turma || !matricula || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await addDoc(collection(firestore, 'Alunos'), {
        uid: user.uid,
        nome,
        idade,
        responsaveis,
        turma,
        matricula,
        email,
        imagemUri: imagemUri || null,
        tipoUsuario, // <- aqui vai o tipo (Admin ou Responsável)
        criadoEm: new Date(),
      });

      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      // Resetar campos
      setNome('');
      setIdade('');
      setResponsaveis('');
      setTurma('');
      setMatricula('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setImagemUri(null);
      setTipoUsuario('Responsável');
    } catch (err) {
      console.log('Erro ao cadastrar:', err.code, err.message);
      if (err.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Esse e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar aluno.');
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cadastro de Aluno</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.imagePicker} onPress={escolherImagem}>
          {imagemUri ? (
            <Image source={{ uri: imagemUri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Selecionar Foto</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome do Aluno</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Idade ou Data de Nascimento</Text>
        <TextInput style={styles.input} value={idade} onChangeText={setIdade} />

        <Text style={styles.label}>Nome dos Pais ou Responsáveis</Text>
        <TextInput style={styles.input} value={responsaveis} onChangeText={setResponsaveis} />

        <Text style={styles.label}>Turma</Text>
        <TextInput style={styles.input} value={turma} onChangeText={setTurma} />

        <Text style={styles.label}>Número de Matrícula</Text>
        <TextInput style={styles.input} value={matricula} onChangeText={setMatricula} />

        <Text style={styles.label}>Tipo de Usuário</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipoUsuario}
            onValueChange={setTipoUsuario}
            style={{ height: 50 }}
          >
            <Picker.Item label="Responsável" value="Responsável" />
            <Picker.Item label="Administrador" value="Administrador" />
          </Picker>
        </View>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleCadastrar} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 6,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
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
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  imageText: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '600',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});