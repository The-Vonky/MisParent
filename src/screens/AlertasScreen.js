import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, firestore } from '../config/firebaseConfig';

export default function AlertasScreen() {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [alertas, setAlertas] = useState([]);
  const [novoAlerta, setNovoAlerta] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('geral'); // geral, material, reuniao
  const [loading, setLoading] = useState(false);

  // Carregar alertas do Firebase
  useEffect(() => {
    const q = query(
      collection(firestore, 'alertas'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlertas(alertasData);
    });

    return unsubscribe;
  }, []);

  const handleEnviarAlerta = async () => {
    if (!novoAlerta.trim()) {
      Alert.alert('Atenção', 'Por favor, digite o conteúdo do alerta.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(firestore, 'alertas'), {
        texto: novoAlerta.trim(),
        tipo: tipoAlerta,
        autorId: currentUser.uid,
        autorNome: currentUser.displayName || 'Administrador',
        createdAt: serverTimestamp(),
        data: new Date().toISOString(),
      });

      setNovoAlerta('');
      Alert.alert('Sucesso', 'Alerta enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
      Alert.alert('Erro', 'Erro ao enviar alerta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'material':
        return 'warning';
      case 'reuniao':
        return 'calendar';
      default:
        return 'information-circle';
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'material':
        return '#f59e0b'; // Laranja
      case 'reuniao':
        return '#1e3a8a'; // Azul escuro
      default:
        return '#6b7280'; // Cinza
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'material':
        return 'Material';
      case 'reuniao':
        return 'Reunião';
      default:
        return 'Geral';
    }
  };

  const formatarData = (data) => {
    if (!data) return '';
    const date = data.toDate ? data.toDate() : new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAlertaItem = ({ item }) => (
    <View style={styles.alertaItem}>
      <View style={styles.alertaHeader}>
        <View style={styles.tipoContainer}>
          <Ionicons 
            name={getTipoIcon(item.tipo)} 
            size={20} 
            color={getTipoColor(item.tipo)} 
          />
          <Text style={[styles.tipoLabel, { color: getTipoColor(item.tipo) }]}>
            {getTipoLabel(item.tipo)}
          </Text>
        </View>
        <Text style={styles.alertaData}>
          {formatarData(item.createdAt || item.data)}
        </Text>
      </View>
      <Text style={styles.alertaTexto}>{item.texto}</Text>
      <Text style={styles.autorTexto}>Por: {item.autorNome}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar com background azul e texto claro */}
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Alertas / Recados</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Seção de Novo Alerta */}
        <View style={styles.novoAlertaContainer}>
          <Text style={styles.sectionTitle}>Novo Alerta</Text>
          
          {/* Seleção de Tipo */}
          <View style={styles.tipoSelectorContainer}>
            <Text style={styles.tipoSelectorLabel}>Tipo do Alerta:</Text>
            <View style={styles.tipoButtons}>
              {['geral', 'material', 'reuniao'].map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.tipoButton,
                    tipoAlerta === tipo && styles.tipoButtonActive
                  ]}
                  onPress={() => setTipoAlerta(tipo)}
                >
                  <Ionicons 
                    name={getTipoIcon(tipo)} 
                    size={16} 
                    color={tipoAlerta === tipo ? '#fff' : getTipoColor(tipo)} 
                  />
                  <Text style={[
                    styles.tipoButtonText,
                    tipoAlerta === tipo && styles.tipoButtonTextActive
                  ]}>
                    {getTipoLabel(tipo)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Campo de Texto */}
          <TextInput
            placeholder="Digite o alerta ou recado..."
            value={novoAlerta}
            onChangeText={setNovoAlerta}
            style={styles.input}
            multiline
            numberOfLines={4}
          />

          {/* Botão Enviar */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleEnviarAlerta}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : 'Enviar Alerta'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seção de Histórico */}
        <View style={styles.historicoContainer}>
          <Text style={styles.sectionTitle}>Histórico de Alertas</Text>
          {alertas.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>
                Nenhum alerta enviado ainda
              </Text>
            </View>
          ) : (
            <FlatList
              data={alertas}
              keyExtractor={(item) => item.id}
              renderItem={renderAlertaItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
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
  placeholder: {
    width: 34, // Para balancear o header
  },
  scrollView: {
    flex: 1,
  },
  novoAlertaContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e3a8a',
  },
  tipoSelectorContainer: {
    marginBottom: 15,
  },
  tipoSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tipoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  tipoButtonActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  tipoButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  tipoButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9fafb',
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historicoContainer: {
    margin: 20,
    marginTop: 0,
  },
  alertaItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  alertaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoLabel: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  alertaData: {
    fontSize: 12,
    color: '#6b7280',
  },
  alertaTexto: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 8,
  },
  autorTexto: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});