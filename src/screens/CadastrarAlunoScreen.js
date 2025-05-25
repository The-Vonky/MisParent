// imports...
import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, SafeAreaView, ScrollView, Image
} from 'react-native';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { auth, firestore } from '../config/firebaseConfig';

export default function CadastrarAlunoScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
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
  const [observacoes, setObservacoes] = useState('');
  const [erros, setErros] = useState({});

  useEffect(() => {
    gerarMatriculaSequencial();
  }, []);

  useEffect(() => {
    if (validarData(dataNascimento)) calcularIdade();
    else setIdade('');
  }, [dataNascimento]);

  const gerarMatriculaSequencial = async () => {
    const q = query(collection(firestore, 'Alunos'), orderBy('matricula'));
    const querySnapshot = await getDocs(q);
    const total = querySnapshot.size + 1;
    const novaMatricula = total.toString().padStart(6, '0');
    setMatricula(novaMatricula);
  };

  const calcularIdade = () => {
    const data = moment(dataNascimento, 'DD/MM/YYYY');
    const hoje = moment();
    const anos = hoje.diff(data, 'years');
    setIdade(anos.toString());
  };

  const padronizarNome = (texto) => {
    return texto.replace(/[^\p{L} ]+/gu, '').replace(/\s+/g, ' ').trim();
  };

  const formatarData = (texto) => {
    const digits = texto.replace(/\D/g, '');
    let formatado = '';

    if (digits.length <= 2) formatado = digits;
    else if (digits.length <= 4) formatado = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    else formatado = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;

    setDataNascimento(formatado);
  };

  const validarData = (data) => {
    const [dia, mes, ano] = data.split('/').map(Number);
    if (!dia || !mes || !ano) return false;
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12) return false;
    const hoje = new Date().getFullYear();
    if (ano < 1900 || ano > hoje) return false;
    return moment(`${dia}/${mes}/${ano}`, 'DD/MM/YYYY', true).isValid();
  };

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir acesso à câmera.');
      return;
    }

    Alert.alert('Foto do Aluno', 'Escolha uma opção', [
      {
        text: 'Galeria',
        onPress: async () => {
          const galeria = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
          });
          if (!galeria.canceled) setImagemUri(galeria.assets[0].uri);
        },
      },
      {
        text: 'Câmera',
        onPress: async () => {
          const camera = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          });
          if (!camera.canceled) setImagemUri(camera.assets[0].uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleCadastrar = async () => {
    const novosErros = {};
    if (!nome) novosErros.nome = 'Nome obrigatório';
    if (!validarData(dataNascimento)) novosErros.dataNascimento = 'Data inválida';
    if (!responsavel1) novosErros.responsavel1 = 'Responsável obrigatório';
    if (!turma) novosErros.turma = 'Turma obrigatória';
    if (!email) novosErros.email = 'E-mail obrigatório';
    if (email !== confirmarEmail) novosErros.confirmarEmail = 'E-mails não coincidem';
    if (!senha) novosErros.senha = 'Senha obrigatória';
    if (senha !== confirmarSenha) novosErros.confirmarSenha = 'Senhas não coincidem';

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await addDoc(collection(firestore, 'Alunos'), {
        uid: user.uid,
        nome: padronizarNome(nome),
        dataNascimento,
        idade,
        responsaveis: [responsavel1, responsavel2].filter(Boolean),
        turma,
        matricula,
        email,
        imagemUri: imagemUri || null,
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
      Alert.alert('Erro', 'Não foi possível cadastrar.');
    }
  };

  const limparCampos = () => {
    setNome('');
    setDataNascimento('');
    setResponsavel1('');
    setResponsavel2('');
    setTurma('');
    setEmail('');
    setConfirmarEmail('');
    setSenha('');
    setConfirmarSenha('');
    setImagemUri(null);
    setObservacoes('');
    setErros({});
  };

  const inputStyle = (campo) => [
    styles.input,
    erros[campo] && { borderColor: 'red', backgroundColor: '#fee2e2' },
  ];

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
            <View style={styles.imageCircle}><Text style={styles.imageText}>Selecionar Foto</Text></View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nome do Aluno</Text>
        <TextInput style={inputStyle('nome')} value={nome} onChangeText={setNome} />
        {erros.nome && <Text style={styles.error}>{erros.nome}</Text>}

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          style={inputStyle('dataNascimento')}
          value={dataNascimento}
          onChangeText={formatarData}
          keyboardType="numeric"
          placeholder="DD/MM/AAAA"
          maxLength={10}
        />
        {erros.dataNascimento && <Text style={styles.error}>{erros.dataNascimento}</Text>}

        <Text style={styles.label}>Idade Calculada</Text>
        <TextInput style={[styles.input, { backgroundColor: '#e5e7eb' }]} value={idade} editable={false} />

        <Text style={styles.label}>Responsável 1</Text>
        <TextInput style={inputStyle('responsavel1')} value={responsavel1} onChangeText={setResponsavel1} />
        {erros.responsavel1 && <Text style={styles.error}>{erros.responsavel1}</Text>}

        <Text style={styles.label}>Responsável 2 (opcional)</Text>
        <TextInput style={styles.input} value={responsavel2} onChangeText={setResponsavel2} />

        <Text style={styles.label}>Turma</Text>
        <TextInput style={inputStyle('turma')} value={turma} onChangeText={setTurma} />
        {erros.turma && <Text style={styles.error}>{erros.turma}</Text>}

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
          style={inputStyle('email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erros.email && <Text style={styles.error}>{erros.email}</Text>}

        <Text style={styles.label}>Confirmar E-mail</Text>
        <TextInput
          style={inputStyle('confirmarEmail')}
          value={confirmarEmail}
          onChangeText={setConfirmarEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erros.confirmarEmail && <Text style={styles.error}>{erros.confirmarEmail}</Text>}

        <Text style={styles.label}>Senha</Text>
        <View style={inputStyle('senha')}>
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
        {erros.senha && <Text style={styles.error}>{erros.senha}</Text>}

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={inputStyle('confirmarSenha')}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarSenha}
        />
        {erros.confirmarSenha && <Text style={styles.error}>{erros.confirmarSenha}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginBottom: -10,
  },
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
  }
});
