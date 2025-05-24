// imports
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';

export default function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [idade, setIdade] = useState('');
  const [responsavel1, setResponsavel1] = useState('');
  const [responsavel2, setResponsavel2] = useState('');
  const [turma, setTurma] = useState('');
  const [matricula, setMatricula] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [emailResponsavel, setEmailResponsavel] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [foto, setFoto] = useState(null);
  const [erros, setErros] = useState({});

  const formatarData = (texto) => {
    let textoFormatado = texto.replace(/[^0-9]/g, '');
    if (textoFormatado.length >= 3 && textoFormatado.length <= 4) {
      textoFormatado = textoFormatado.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    } else if (textoFormatado.length > 4) {
      textoFormatado = textoFormatado.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    }
    setDataNascimento(textoFormatado);
  };

  const validarData = (data) => {
    return moment(data, 'DD/MM/YYYY', true).isValid() &&
      moment(data, 'DD/MM/YYYY').isBefore(moment()) &&
      moment(data, 'DD/MM/YYYY').year() >= 1900;
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada para usar a câmera!');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  const escolherFotoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada para acessar a galeria!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  const validarCampos = () => {
    const novosErros = {};
    if (!nome) novosErros.nome = 'Nome obrigatório';
    if (!dataNascimento || !validarData(dataNascimento)) novosErros.dataNascimento = 'Data inválida';
    if (!emailResponsavel) novosErros.email = 'Email obrigatório';
    if (!senha) novosErros.senha = 'Senha obrigatória';
    if (senha !== confirmarSenha) novosErros.confirmarSenha = 'Senhas não coincidem';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const cadastrarAluno = async () => {
    if (!validarCampos()) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailResponsavel, senha);
      const user = userCredential.user;

      const alunoData = {
        nome,
        dataNascimento,
        idade,
        responsavel1,
        responsavel2,
        turma,
        matricula,
        observacoes,
        emailResponsavel,
        foto
      };

      await setDoc(doc(db, 'Alunos', user.uid), alunoData);
      await setDoc(doc(db, 'Users', user.uid), {
        email: emailResponsavel,
        tipo: 'pai'
      });

      Alert.alert('Aluno cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao cadastrar:', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={tirarFoto} onLongPress={escolherFotoGaleria}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.fotoPlaceholder]}>
              <Text style={styles.fotoTexto}>Selecionar Foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={[styles.input, erros.nome && styles.erroInput]}
          placeholder="Nome do aluno"
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && <Text style={styles.erroTexto}>{erros.nome}</Text>}

        <TextInput
          style={[styles.input, erros.dataNascimento && styles.erroInput]}
          placeholder="Data de nascimento (dd/mm/aaaa)"
          keyboardType="numeric"
          value={dataNascimento}
          onChangeText={formatarData}
        />
        {erros.dataNascimento && <Text style={styles.erroTexto}>{erros.dataNascimento}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Idade"
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Responsável 1"
          value={responsavel1}
          onChangeText={setResponsavel1}
        />

        <TextInput
          style={styles.input}
          placeholder="Responsável 2 (opcional)"
          value={responsavel2}
          onChangeText={setResponsavel2}
        />

        <TextInput
          style={styles.input}
          placeholder="Turma"
          value={turma}
          onChangeText={setTurma}
        />

        <TextInput
          style={styles.input}
          placeholder="Matrícula"
          value={matricula}
          onChangeText={setMatricula}
        />

        <TextInput
          style={styles.input}
          placeholder="Observações"
          value={observacoes}
          onChangeText={setObservacoes}
        />

        <TextInput
          style={[styles.input, erros.email && styles.erroInput]}
          placeholder="Email do responsável"
          value={emailResponsavel}
          onChangeText={setEmailResponsavel}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erros.email && <Text style={styles.erroTexto}>{erros.email}</Text>}

        <TextInput
          style={[styles.input, erros.senha && styles.erroInput]}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        {erros.senha && <Text style={styles.erroTexto}>{erros.senha}</Text>}

        <TextInput
          style={[styles.input, erros.confirmarSenha && styles.erroInput]}
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarConfirmarSenha}
        />
        {erros.confirmarSenha && <Text style={styles.erroTexto}>{erros.confirmarSenha}</Text>}

        <TouchableOpacity style={styles.botao} onPress={cadastrarAluno}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  botao: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  erroInput: {
    borderColor: 'red',
  },
  erroTexto: {
    color: 'red',
    marginBottom: 8,
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 16,
  },
  fotoPlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fotoTexto: {
    color: '#555'
  }
});
