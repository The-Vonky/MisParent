import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, SafeAreaView, ScrollView, Image, StatusBar, Modal, FlatList
} from 'react-native';
import { collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { auth, firestore } from '../config/firebaseConfig';

export default function CadastrarAlunoScreen() {
  const navigation = useNavigation();
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
  const [modalidadeEnsino, setModalidadeEnsino] = useState('');
  const [professor, setProfessor] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTurmaModal, setShowTurmaModal] = useState(false);
  const [showModalidadeModal, setShowModalidadeModal] = useState(false);

  // Opções predefinidas
  const turmasDisponiveis = [
    'Berçário I', 'Berçário II', 'Maternal I', 'Maternal II', 
    'Jardim I', 'Jardim II', 'Pré-escola I', 'Pré-escola II'
  ];

  const modalidadesEnsino = [
    'Período Integral', 'Período Parcial - Manhã', 'Período Parcial - Tarde'
  ];

  useEffect(() => {
    gerarMatriculaSequencial();
  }, []);

  useEffect(() => {
    if (validarData(dataNascimento)) calcularIdade();
    else setIdade('');
  }, [dataNascimento]);

  const gerarMatriculaSequencial = async () => {
    try {
      const q = query(collection(firestore, 'Alunos'), orderBy('matricula'));
      const querySnapshot = await getDocs(q);
      const total = querySnapshot.size + 1;
      const novaMatricula = total.toString().padStart(6, '0');
      setMatricula(novaMatricula);
    } catch (error) {
      console.log('Erro ao gerar matrícula:', error);
      setMatricula('000001');
    }
  };

  const calcularIdade = () => {
    const data = moment(dataNascimento, 'DD/MM/YYYY');
    const hoje = moment();
    const anos = hoje.diff(data, 'years');
    const meses = hoje.diff(data, 'months') % 12;
    
    let idadeTexto = '';
    if (anos > 0) {
      idadeTexto += `${anos} ano${anos > 1 ? 's' : ''}`;
      if (meses > 0) idadeTexto += ` e ${meses} mês${meses > 1 ? 'es' : ''}`;
    } else if (meses > 0) {
      idadeTexto = `${meses} mês${meses > 1 ? 'es' : ''}`;
    } else {
      const dias = hoje.diff(data, 'days');
      idadeTexto = `${dias} dia${dias > 1 ? 's' : ''}`;
    }
    
    setIdade(idadeTexto);
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
    if (!data || data.length !== 10) return false;
    const [dia, mes, ano] = data.split('/').map(Number);
    if (!dia || !mes || !ano) return false;
    if (dia < 1 || dia > 31 || mes < 1 || mes > 12) return false;
    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual) return false;

    const dataMoment = moment(data, 'DD/MM/YYYY', true);
    if (!dataMoment.isValid()) return false;
    if (dataMoment.isAfter(moment())) return false;

    return true;
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
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!galeria.canceled) setImagemUri(galeria.assets[0].uri);
        },
      },
      {
        text: 'Câmera',
        onPress: async () => {
          const camera = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!camera.canceled) setImagemUri(camera.assets[0].uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleCadastrar = async () => {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = 'Nome obrigatório';
    if (!validarData(dataNascimento)) novosErros.dataNascimento = 'Data inválida';
    if (!responsavel1.trim()) novosErros.responsavel1 = 'Responsável obrigatório';
    if (!turma) novosErros.turma = 'Turma obrigatória';
    if (!modalidadeEnsino) novosErros.modalidadeEnsino = 'Modalidade obrigatória';
    if (!professor.trim()) novosErros.professor = 'Professor obrigatório';
    if (!email.trim()) novosErros.email = 'E-mail obrigatório';
    if (email !== confirmarEmail) novosErros.confirmarEmail = 'E-mails não coincidem';
    if (!senha) novosErros.senha = 'Senha obrigatória';
    if (senha.length < 6) novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    if (senha !== confirmarSenha) novosErros.confirmarSenha = 'Senhas não coincidem';

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      Alert.alert('Atenção', 'Por favor, corrija os campos destacados em vermelho.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'Alunos', user.uid), {
        uid: user.uid,
        nome: padronizarNome(nome),
        dataNascimento,
        idade,
        responsaveis: [responsavel1.trim(), responsavel2.trim()].filter(Boolean),
        turma,
        modalidadeEnsino,
        professor: professor.trim(),
        matricula,
        email: email.toLowerCase().trim(),
        imagemUri: imagemUri || null,
        observacoes: observacoes.trim(),
        criadoEm: new Date(),
        ativo: true,
      });

      await setDoc(doc(firestore, 'Users', user.uid), {
        email: email.toLowerCase().trim(),
        role: 'pai',
        nome: responsavel1.trim(),
        criadoEm: new Date(),
      });

      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!', [
        { text: 'OK', onPress: () => {
          limparCampos();
          gerarMatriculaSequencial();
        }}
      ]);
    } catch (err) {
      console.log('Erro ao cadastrar:', err);
      let mensagemErro = 'Não foi possível cadastrar o aluno.';
      
      if (err.code === 'auth/email-already-in-use') {
        mensagemErro = 'Este e-mail já está sendo usado por outro usuário.';
      } else if (err.code === 'auth/weak-password') {
        mensagemErro = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        mensagemErro = 'O formato do e-mail é inválido.';
      }
      
      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const limparCampos = () => {
    setNome('');
    setDataNascimento('');
    setResponsavel1('');
    setResponsavel2('');
    setTurma('');
    setModalidadeEnsino('');
    setProfessor('');
    setEmail('');
    setConfirmarEmail('');
    setSenha('');
    setConfirmarSenha('');
    setImagemUri(null);
    setObservacoes('');
    setErros({});
    setIdade('');
  };

  const inputStyle = (campo) => [
    styles.input,
    erros[campo] && styles.inputError,
  ];

  const renderModal = (visible, setVisible, options, selectedValue, onSelect, title) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  selectedValue === item && styles.modalOptionSelected
                ]}
                onPress={() => {
                  onSelect(item);
                  setVisible(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedValue === item && styles.modalOptionTextSelected
                ]}>
                  {item}
                </Text>
                {selectedValue === item && (
                  <Ionicons name="checkmark" size={20} color="#1e3a8a" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cadastro de Aluno</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Foto do Aluno */}
        <View style={styles.fotoSection}>
          <Text style={styles.sectionTitle}>Foto de Identificação</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={escolherImagem}>
            {imagemUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imagemUri }} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              </View>
            ) : (
              <View style={styles.imageCircle}>
                <Ionicons name="camera" size={32} color="#6b7280" />
                <Text style={styles.imageText}>Adicionar Foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Dados Pessoais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          
          <Text style={styles.label}>Nome Completo do Aluno *</Text>
          <TextInput 
            style={inputStyle('nome')} 
            value={nome} 
            onChangeText={(text) => setNome(padronizarNome(text))}
            placeholder="Digite o nome completo"
          />
          {erros.nome && <Text style={styles.error}>{erros.nome}</Text>}

          <Text style={styles.label}>Data de Nascimento *</Text>
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
          <TextInput 
            style={[styles.input, styles.inputDisabled]} 
            value={idade} 
            editable={false} 
            placeholder="Será calculada automaticamente"
          />
        </View>

        {/* Responsáveis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsáveis</Text>
          
          <Text style={styles.label}>Responsável Principal *</Text>
          <TextInput 
            style={inputStyle('responsavel1')} 
            value={responsavel1} 
            onChangeText={(text) => setResponsavel1(padronizarNome(text))}
            placeholder="Nome do responsável principal"
          />
          {erros.responsavel1 && <Text style={styles.error}>{erros.responsavel1}</Text>}

          <Text style={styles.label}>Responsável Secundário</Text>
          <TextInput 
            style={styles.input} 
            value={responsavel2} 
            onChangeText={(text) => setResponsavel2(padronizarNome(text))}
            placeholder="Nome do responsável secundário (opcional)"
          />
        </View>

        {/* Dados Escolares */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Escolares</Text>
          
          <Text style={styles.label}>Turma *</Text>
          <TouchableOpacity 
            style={inputStyle('turma')}
            onPress={() => setShowTurmaModal(true)}
          >
            <Text style={[styles.inputText, !turma && styles.placeholder]}>
              {turma || 'Selecione a turma'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>
          {erros.turma && <Text style={styles.error}>{erros.turma}</Text>}

          <Text style={styles.label}>Modalidade de Ensino *</Text>
          <TouchableOpacity 
            style={inputStyle('modalidadeEnsino')}
            onPress={() => setShowModalidadeModal(true)}
          >
            <Text style={[styles.inputText, !modalidadeEnsino && styles.placeholder]}>
              {modalidadeEnsino || 'Selecione a modalidade'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6b7280" />
          </TouchableOpacity>
          {erros.modalidadeEnsino && <Text style={styles.error}>{erros.modalidadeEnsino}</Text>}

          <Text style={styles.label}>Professor(a) Responsável *</Text>
          <TextInput 
            style={inputStyle('professor')} 
            value={professor} 
            onChangeText={(text) => setProfessor(padronizarNome(text))}
            placeholder="Nome do professor responsável"
          />
          {erros.professor && <Text style={styles.error}>{erros.professor}</Text>}

          <Text style={styles.label}>Número de Matrícula</Text>
          <TextInput 
            style={[styles.input, styles.inputDisabled]} 
            value={matricula} 
            editable={false} 
            placeholder="Gerado automaticamente"
          />
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <Text style={styles.label}>Observações Gerais</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={4}
            placeholder="Informações adicionais sobre o aluno (alergias, necessidades especiais, etc.)"
            textAlignVertical="top"
          />
        </View>

        {/* Dados de Acesso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados de Acesso dos Pais</Text>
          
          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={inputStyle('email')}
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase().trim())}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="email@exemplo.com"
          />
          {erros.email && <Text style={styles.error}>{erros.email}</Text>}

          <Text style={styles.label}>Confirmar E-mail *</Text>
          <TextInput
            style={inputStyle('confirmarEmail')}
            value={confirmarEmail}
            onChangeText={(text) => setConfirmarEmail(text.toLowerCase().trim())}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Confirme o e-mail"
          />
          {erros.confirmarEmail && <Text style={styles.error}>{erros.confirmarEmail}</Text>}

          <Text style={styles.label}>Senha *</Text>
          <View style={[styles.senhaContainer, erros.senha && styles.inputError]}>
            <TextInput
              style={styles.senhaInput}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              placeholder="Mínimo 6 caracteres"
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons name={mostrarSenha ? 'eye' : 'eye-off'} size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {erros.senha && <Text style={styles.error}>{erros.senha}</Text>}

          <Text style={styles.label}>Confirmar Senha *</Text>
          <View style={[styles.senhaContainer, erros.confirmarSenha && styles.inputError]}>
            <TextInput
              style={styles.senhaInput}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              placeholder="Confirme a senha"
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons name={mostrarSenha ? 'eye' : 'eye-off'} size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {erros.confirmarSenha && <Text style={styles.error}>{erros.confirmarSenha}</Text>}
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity 
          style={[styles.botao, loading && styles.botaoDisabled]} 
          onPress={handleCadastrar}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.botaoTexto}>Cadastrando...</Text>
          ) : (
            <Text style={styles.botaoTexto}>Cadastrar Aluno</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      {renderModal(
        showTurmaModal,
        setShowTurmaModal,
        turmasDisponiveis,
        turma,
        setTurma,
        'Selecionar Turma'
      )}

      {renderModal(
        showModalidadeModal,
        setShowModalidadeModal,
        modalidadesEnsino,
        modalidadeEnsino,
        setModalidadeEnsino,
        'Selecionar Modalidade'
      )}
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
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  fotoSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    color: '#374151',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputDisabled: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
  },
  inputText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholder: {
    color: '#9ca3af',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: '#ef4444',
    marginTop: 4,
    fontSize: 12,
  },
  imagePicker: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  imageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  imageText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1e3a8a',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  senhaContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  senhaInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  botao: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botaoDisabled: {
    backgroundColor: '#9ca3af',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    maxHeight: '70%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  modalOptionTextSelected: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
});