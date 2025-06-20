import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SecretariaScreen({ route }) {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('horarios');
  const [expandedItem, setExpandedItem] = useState(null);

  // Get student ID from route params if available
  const studentId = route?.params?.studentId;

  // Mock data para informações da secretaria
  const secretariaData = useMemo(() => ({
    escola: {
      nome: 'Escola Infantil Pequenos Sonhos',
      endereco: 'Rua das Crianças, 456 - Centro',
      cidade: 'São Paulo - SP',
      cep: '01234-567',
      telefone: '(11) 3456-7890',
      email: 'secretaria@pequenossonhos.com.br',
      site: 'www.pequenossonhos.com.br'
    },
    horarios: {
      funcionamento: 'Segunda a Sexta: 07:00 às 18:00',
      secretaria: 'Segunda a Sexta: 07:30 às 17:30',
      almoco: '12:00 às 13:00 (Funcionamento reduzido)',
      sabado: 'Fechado',
      domingo: 'Fechado',
      feriados: 'Consultar calendário escolar'
    },
    servicos: [
      {
        id: '1',
        titulo: 'Atendimento aos Pais',
        horario: 'Segunda a Sexta: 08:00 às 17:00',
        descricao: 'Esclarecimento de dúvidas, informações sobre o aluno e procedimentos escolares',
        responsavel: 'Maria Santos',
        telefone: '(11) 3456-7890',
        ramal: '101',
        icon: 'people-outline'
      },
      {
        id: '2',
        titulo: 'Documentação Escolar',
        horario: 'Segunda a Sexta: 09:00 às 16:00',
        descricao: 'Emissão de declarações, históricos, transferências e certificados',
        responsavel: 'João Silva',
        telefone: '(11) 3456-7890',
        ramal: '102',
        icon: 'document-text-outline'
      },
      {
        id: '3',
        titulo: 'Financeiro',
        horario: 'Segunda a Sexta: 08:30 às 16:30',
        descricao: 'Pagamentos, boletos, negociação de mensalidades e questões financeiras',
        responsavel: 'Ana Costa',
        telefone: '(11) 3456-7890',
        ramal: '103',
        icon: 'card-outline'
      },
      {
        id: '4',
        titulo: 'Coordenação Pedagógica',
        horario: 'Segunda a Sexta: 08:00 às 17:00',
        descricao: 'Reuniões pedagógicas, acompanhamento escolar e orientações educacionais',
        responsavel: 'Prof. Carla Lima',
        telefone: '(11) 3456-7890',
        ramal: '104',
        icon: 'school-outline'
      },
      {
        id: '5',
        titulo: 'Nutrição',
        horario: 'Segunda a Sexta: 07:00 às 15:00',
        descricao: 'Cardápio, restrições alimentares e orientações nutricionais',
        responsavel: 'Dra. Paula Mendes',
        telefone: '(11) 3456-7890',
        ramal: '105',
        icon: 'nutrition-outline'
      },
      {
        id: '6',
        titulo: 'Enfermaria',
        horario: 'Segunda a Sexta: 07:30 às 17:30',
        descricao: 'Primeiros socorros, medicamentos e acompanhamento de saúde',
        responsavel: 'Enf. Roberto Dias',
        telefone: '(11) 3456-7890',
        ramal: '106',
        icon: 'medical-outline'
      }
    ],
    contatos: [
      {
        id: '1',
        departamento: 'Secretaria Geral',
        responsavel: 'Maria Santos',
        telefone: '(11) 3456-7890',
        email: 'secretaria@pequenossonhos.com.br',
        whatsapp: '(11) 99999-0001',
        icon: 'business-outline'
      },
      {
        id: '2',
        departamento: 'Direção',
        responsavel: 'Prof. Carlos Oliveira',
        telefone: '(11) 3456-7891',  
        email: 'direcao@pequenossonhos.com.br',
        whatsapp: '(11) 99999-0002',
        icon: 'person-outline'
      },
      {
        id: '3',
        departamento: 'Coordenação',
        responsavel: 'Prof. Carla Lima',
        telefone: '(11) 3456-7892',
        email: 'coordenacao@pequenossonhos.com.br',
        whatsapp: '(11) 99999-0003',
        icon: 'school-outline'
      },
      {
        id: '4',
        departamento: 'Emergência',
        responsavel: 'Plantão 24h',
        telefone: '(11) 99999-9999',
        email: 'emergencia@pequenossonhos.com.br',
        whatsapp: '(11) 99999-9999',
        icon: 'alert-circle-outline',
        isEmergency: true
      }
    ]
  }), []);

  // Enhanced handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Here you would fetch fresh data from your API
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleCall = useCallback((telefone) => {
    const phoneNumber = telefone.replace(/[^\d]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  }, []);

  const handleWhatsApp = useCallback((whatsapp) => {
    const phoneNumber = whatsapp.replace(/[^\d]/g, '');
    Linking.openURL(`whatsapp://send?phone=55${phoneNumber}`);
  }, []);

  const handleEmail = useCallback((email) => {
    Linking.openURL(`mailto:${email}`);
  }, []);

  const handleWebsite = useCallback(() => {
    Linking.openURL(`https://${secretariaData.escola.site}`);
  }, [secretariaData.escola.site]);

  const toggleExpanded = useCallback((itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  }, [expandedItem]);

  // Render functions
  const renderHorarioItem = ({ item }) => (
    <View style={styles.horarioItem}>
      <Text style={styles.horarioLabel}>{item.label}</Text>
      <Text style={styles.horarioValue}>{item.value}</Text>
    </View>
  );

  const renderServicoItem = ({ item }) => {
    const isExpanded = expandedItem === item.id;

    return (
      <View style={styles.servicoContainer}>
        <TouchableOpacity 
          style={styles.servicoItem}
          onPress={() => toggleExpanded(item.id)}
        >
          <View style={styles.servicoIconContainer}>
            <Ionicons name={item.icon} size={24} color="#1e3a8a" />
          </View>
          <View style={styles.servicoContent}>
            <Text style={styles.servicoTitulo}>{item.titulo}</Text>
            <Text style={styles.servicoHorario}>{item.horario}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.servicoDetalhes}>
            <Text style={styles.servicoDescricao}>{item.descricao}</Text>
            <View style={styles.servicoResponsavel}>
              <Text style={styles.responsavelLabel}>Responsável:</Text>
              <Text style={styles.responsavelNome}>{item.responsavel}</Text>
            </View>
            <View style={styles.contatoActions}>
              <TouchableOpacity 
                style={styles.contatoButton}
                onPress={() => handleCall(item.telefone)}
              >
                <Ionicons name="call" size={16} color="#1e3a8a" />
                <Text style={styles.contatoButtonText}>Ligar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contatoButton}
                onPress={() => handleCall(`${item.telefone},${item.ramal}`)}
              >
                <Ionicons name="keypad" size={16} color="#1e3a8a" />
                <Text style={styles.contatoButtonText}>Ramal {item.ramal}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderContatoItem = ({ item }) => (
    <View style={[styles.contatoItem, item.isEmergency && styles.emergencyContact]}>
      <View style={styles.contatoHeader}>
        <View style={styles.contatoIconContainer}>
          <Ionicons 
            name={item.icon} 
            size={24} 
            color={item.isEmergency ? "#ef4444" : "#1e3a8a"} 
          />
        </View>
        <View style={styles.contatoInfo}>
          <Text style={[
            styles.contatoDepartamento,
            item.isEmergency && styles.emergencyText
          ]}>
            {item.departamento}
          </Text>
          <Text style={styles.contatoResponsavel}>{item.responsavel}</Text>
        </View>
      </View>
      
      <View style={styles.contatoDetalhes}>
        <TouchableOpacity 
          style={styles.contatoRow}
          onPress={() => handleCall(item.telefone)}
        >
          <Ionicons name="call-outline" size={16} color="#6b7280" />
          <Text style={styles.contatoTexto}>{item.telefone}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contatoRow}
          onPress={() => handleWhatsApp(item.whatsapp)}
        >
          <Ionicons name="logo-whatsapp" size={16} color="#10b981" />
          <Text style={styles.contatoTexto}>{item.whatsapp}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contatoRow}
          onPress={() => handleEmail(item.email)}
        >
          <Ionicons name="mail-outline" size={16} color="#6b7280" />
          <Text style={styles.contatoTexto}>{item.email}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'horarios':
        const horariosData = [
          { label: 'Funcionamento', value: secretariaData.horarios.funcionamento },
          { label: 'Secretaria', value: secretariaData.horarios.secretaria },
          { label: 'Horário de Almoço', value: secretariaData.horarios.almoco },
          { label: 'Sábados', value: secretariaData.horarios.sabado },
          { label: 'Domingos', value: secretariaData.horarios.domingo },
          { label: 'Feriados', value: secretariaData.horarios.feriados },
        ];

        return (
          <View>
            <FlatList
              data={horariosData}
              renderItem={renderHorarioItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );

      case 'servicos':
        return (
          <FlatList
            data={secretariaData.servicos}
            renderItem={renderServicoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'contatos':
        return (
          <FlatList
            data={secretariaData.contatos}
            renderItem={renderContatoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        );

      default:
        return null;
    }
  };

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
        <Text style={styles.headerText}>Secretaria</Text>
        <TouchableOpacity 
          style={styles.websiteButton} 
          onPress={handleWebsite}
        >
          <Ionicons name="globe-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1e3a8a']}
            tintColor="#1e3a8a"
          />
        }
      >
        {/* School Info Card */}
        <View style={styles.schoolCard}>
          <View style={styles.schoolHeader}>
            <Ionicons name="school" size={32} color="#1e3a8a" />
            <View style={styles.schoolInfo}>
              <Text style={styles.schoolName}>{secretariaData.escola.nome}</Text>
              <Text style={styles.schoolAddress}>{secretariaData.escola.endereco}</Text>
              <Text style={styles.schoolCity}>{secretariaData.escola.cidade} - {secretariaData.escola.cep}</Text>
            </View>
          </View>
          
          <View style={styles.quickContacts}>
            <TouchableOpacity 
              style={styles.quickContactButton}
              onPress={() => handleCall(secretariaData.escola.telefone)}
            >
              <Ionicons name="call" size={20} color="#1e3a8a" />
              <Text style={styles.quickContactText}>Ligar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickContactButton}
              onPress={() => handleEmail(secretariaData.escola.email)}
            >
              <Ionicons name="mail" size={20} color="#1e3a8a" />
              <Text style={styles.quickContactText}>Email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickContactButton}
              onPress={handleWebsite}
            >
              <Ionicons name="globe" size={20} color="#1e3a8a" />
              <Text style={styles.quickContactText}>Site</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'horarios' && styles.activeTab]}
            onPress={() => setSelectedTab('horarios')}
          >
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={selectedTab === 'horarios' ? '#fff' : '#6b7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'horarios' && styles.activeTabText]}>
              Horários
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'servicos' && styles.activeTab]}
            onPress={() => setSelectedTab('servicos')}
          >
            <Ionicons 
              name="list-outline" 
              size={16} 
              color={selectedTab === 'servicos' ? '#fff' : '#6b7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'servicos' && styles.activeTabText]}>
              Serviços
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'contatos' && styles.activeTab]}
            onPress={() => setSelectedTab('contatos')}
          >
            <Ionicons 
              name="people-outline" 
              size={16} 
              color={selectedTab === 'contatos' ? '#fff' : '#6b7280'} 
            />
            <Text style={[styles.tabText, selectedTab === 'contatos' && styles.activeTabText]}>
              Contatos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {renderTabContent()}
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
  websiteButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  schoolCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  schoolInfo: {
    marginLeft: 16,
    flex: 1,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  schoolAddress: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  schoolCity: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickContacts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  quickContactButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  quickContactText: {
    fontSize: 12,
    color: '#1e3a8a',
    marginTop: 4,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#1e3a8a',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContentContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  // Horários styles
  horarioItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horarioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  horarioValue: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  // Serviços styles
  servicoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  servicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  servicoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  servicoContent: {
    flex: 1,
  },
  servicoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  servicoHorario: {
    fontSize: 12,
    color: '#6b7280',
  },
  servicoDetalhes: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  servicoDescricao: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  servicoResponsavel: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  responsavelLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  responsavelNome: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '600',
    marginLeft: 8,
  },
  contatoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contatoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    gap: 6,
  },
  contatoButtonText: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  // Contatos styles
  contatoItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emergencyContact: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  contatoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contatoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contatoInfo: {
    flex: 1,
  },
  contatoDepartamento: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  emergencyText: {
    color: '#ef4444',
  },
  contatoResponsavel: {
    fontSize: 12,
    color: '#6b7280',
  },
  contatoDetalhes: {
    gap: 8,
  },
  contatoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  contatoTexto: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
});