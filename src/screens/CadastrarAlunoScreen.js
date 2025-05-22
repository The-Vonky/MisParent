import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, SafeAreaView, ScrollView, Image
} from 'react-native';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from 'moment';

import { auth, firestore } from '../config/firebaseConfig';

export default function CadastrarAlunoScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [idade, setIdade] = useState('');
  const [responsavel1, setResponsavel1] = useState('');
  const [responsavel2, setResponsavel2] = useState('');
  const [turma, setTurma] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [imagemUri, setImagemUri] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('Responsável');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    gerarMatriculaSequencial();
  }, []);

  useEffect(() => {
    calcularIdade();
  }, [dataNascimento]);

  const gerarMatriculaSequencial = async () => {
    const q = query(collection(firestore, 'Alunos'), orderBy('matricula'));
    const querySnapshot = await getDocs(q);
    const total = querySnapshot.size + 1;
    const novaMatricula = total.toString().padStart(6, '0');
    setMatricula(novaMatricula);
  };

  const calcularIdade = () => {
    const hoje = moment();
    const nascimento = moment(dataNascimento);
    const anos = hoje.diff(nascimento, 'years');
    setIdade(anos.toString());
  };

  const padronizarNome = (texto) => {
    return texto
      .replace(/[^À-ſa-zA-Z ]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

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
    if (!nome || !responsavel1 || !turma || !email || !confirmarEmail || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (email !== confirmarEmail) {
      Alert.alert('Erro', 'Os e-mails não coincidem.');
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
        nome: padronizarNome(nome),
        dataNascimento: moment(dataNascimento).format('DD/MM/YYYY'),
        idade,
        responsaveis: [responsavel1, responsavel2].filter(Boolean),
        turma,
        matricula,
        email,
        imagemUri: imagemUri || null,
        tipoUsuario,
        observacoes,
        criadoEm: new Date(),
      });

      await addDoc(collection(firestore, 'Users'), {
        email,
        tipo: 'pai',
      });

      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      limparCampos();
    } catch (err) {
      console.log('Erro ao cadastrar:', err.code, err.message);
      Alert.alert('Erro', 'Não foi possível cadastrar.');
    }
  };

  const limparCampos = () => {
    setNome('');
    setDataNascimento(new Date());
    setResponsavel1('');
    setResponsavel2('');
    setTurma('');
    setEmail('');
    setConfirmarEmail('');
    setSenha('');
    setConfirmarSenha('');
    setImagemUri(null);
    setObservacoes('');
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

        <Text style={styles.label}>Data de Nascimento</Text>
        <TouchableOpacity
          onPress={() =>
            DateTimePickerAndroid.open({
              value: dataNascimento,
              onChange: (event, selectedDate) => {
                if (selectedDate) setDataNascimento(selectedDate);
              },
              mode: 'date',
              is24Hour: true,
            })
          }
          style={styles.input}
        >
          <Text>{moment(dataNascimento).format('DD/MM/YYYY')}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Idade Calculada</Text>
        <TextInput style={[styles.input, { backgroundColor: '#e5e7eb' }]} value={idade} editable={false} />

        <Text style={styles.label}>Nome dos Responsáveis</Text>
        <TextInput style={styles.input} placeholder="Responsável 1" value={responsavel1} onChangeText={setResponsavel1} />
        <TextInput style={styles.input} placeholder="Responsável 2 (opcional)" value={responsavel2} onChangeText={setResponsavel2} />

        <Text style={styles.label}>Turma</Text>
        <TextInput style={styles.input} value={turma} onChangeText={setTurma} />

        <Text style={styles.label}>Número de Matrícula</Text>
        <TextInput style={[styles.input, { backgroundColor: '#e5e7eb' }]} value={matricula} editable={false} />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Confirmar E-mail</Text>
        <TextInput
          style={styles.input}
          value={confirmarEmail}
          onChangeText={setConfirmarEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.senhaContainer}>
          <TextInput
            style={styles.senhaInput}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Ionicons name={mostrarSenha ? 'eye-off' : 'eye'} size={20} color="#1e3a8a" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarSenha}
        />

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
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  senhaInput: {
    flex: 1,
    paddingVertical: 12,
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
});
