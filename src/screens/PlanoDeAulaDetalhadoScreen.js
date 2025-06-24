import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { height: screenHeight } = Dimensions.get('window');

export default function PlanoDeAulaDetalhado({ route }) {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState('1º Bimestre');

  // Dados vindos da tela anterior
  const { materia } = route.params || { materia: 'Português' };

  // Configuração da matéria
  const materiaConfig = useMemo(() => {
    const configs = {
      'Português': { 
        icon: 'book-outline', 
        cor: '#10b981', 
        descricao: 'Língua Portuguesa e Literatura' 
      },
      'Inglês': { 
        icon: 'language-outline', 
        cor: '#3b82f6', 
        descricao: 'Língua Inglesa' 
      },
      'História': { 
        icon: 'library-outline', 
        cor: '#8b5cf6', 
        descricao: 'História Geral e do Brasil' 
      },
      'Matemática': { 
        icon: 'calculator-outline', 
        cor: '#f59e0b', 
        descricao: 'Matemática e Cálculo' 
      },
      'Geografia': { 
        icon: 'earth-outline', 
        cor: '#ef4444', 
        descricao: 'Geografia Física e Humana' 
      },
    };
    return configs[materia] || configs['Português'];
  }, [materia]);

  // Dados mockados dos planos de aula
  const planosData = useMemo(() => ({
    materia: materia,
    professor: 'Prof. Maria Silva',
    turma: '2º Ano A',
    ano: '2025',
    periodos: ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'],
    planos: {
      '1º Bimestre': [
        {
          id: '1',
          titulo: 'Introdução à Literatura Brasileira',
          data: '2025-03-10',
          duracao: '50 min',
          objetivos: [
            'Identificar características do Romantismo brasileiro',
            'Analisar obras de José de Alencar',
            'Compreender o contexto histórico do período'
          ],
          conteudo: 'Romantismo no Brasil - Características e principais autores',
          metodologia: 'Aula expositiva com análise de textos literários',
          recursos: ['Livro didático', 'Projetor', 'Textos impressos'],
          avaliacao: 'Participação em discussões e exercícios em classe',
          observacoes: 'Verificar conhecimento prévio dos alunos sobre o período histórico',
          status: 'Concluída',
          feedback: 'Aula bem recebida pelos alunos. Boa participação nas discussões.'
        },
        {
          id: '2',
          titulo: 'Análise de "O Guarani"',
          data: '2025-03-15',
          duracao: '50 min',
          objetivos: [
            'Analisar a obra "O Guarani" de José de Alencar',
            'Identificar elementos românticos na narrativa',
            'Desenvolver senso crítico literário'
          ],
          conteudo: 'Leitura e análise da obra "O Guarani"',
          metodologia: 'Discussão dirigida e análise textual colaborativa',
          recursos: ['Livro "O Guarani"', 'Quadro branco', 'Fichas de análise'],
          avaliacao: 'Produção de resenha crítica individual',
          observacoes: 'Estimular a participação de alunos mais tímidos',
          status: 'Concluída',
          feedback: 'Excelente engajamento. As resenhas demonstraram boa compreensão.'
        },
        {
          id: '3',
          titulo: 'Figuras de Linguagem',
          data: '2025-03-20',
          duracao: '50 min',
          objetivos: [
            'Identificar principais figuras de linguagem',
            'Aplicar figuras de linguagem em textos próprios',
            'Compreender o efeito estilístico das figuras'
          ],
          conteudo: 'Metáfora, metonímia, antítese e outras figuras de linguagem',
          metodologia: 'Aula prática com exercícios e criação de textos',
          recursos: ['Apostila de exercícios', 'Exemplos literários', 'Quadro'],
          avaliacao: 'Exercícios práticos e criação de poema com figuras de linguagem',
          observacoes: 'Usar exemplos da música popular para facilitar compreensão',
          status: 'Planejada',
          feedback: null
        }
      ],
      '2º Bimestre': [
        {
          id: '4',
          titulo: 'Realismo e Naturalismo',
          data: '2025-05-12',
          duracao: '50 min',
          objetivos: [
            'Distinguir Realismo de Naturalismo',
            'Analisar características das escolas literárias',
            'Contextualizar historicamente os movimentos'
          ],
          conteudo: 'Características do Realismo e Naturalismo brasileiro',
          metodologia: 'Aula comparativa com análise de trechos literários',
          recursos: ['Textos de Machado de Assis e Aluísio Azevedo', 'Projetor'],
          avaliacao: 'Quadro comparativo entre as duas escolas',
          observacoes: 'Enfatizar as diferenças de abordagem social',
          status: 'Planejada',
          feedback: null
        },
        {
          id: '5',
          titulo: 'Dom Casmurro - Análise',
          data: '2025-05-18',
          duracao: '50 min',
          objetivos: [
            'Analisar a narrativa em primeira pessoa',
            'Discutir a questão da traição em Dom Casmurro',
            'Compreender a ironia machadiana'
          ],
          conteudo: 'Análise da obra "Dom Casmurro" de Machado de Assis',
          metodologia: 'Seminário com grupos de discussão',
          recursos: ['Livro Dom Casmurro', 'Roteiro de discussão'],
          avaliacao: 'Participação no seminário e ensaio argumentativo',
          observacoes: 'Dividir turma em grupos: defensores e acusadores de Capitu',
          status: 'Planejada',
          feedback: null
        }
      ]
    }
  }), [materia]);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os planos de aula');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handlePlanoPress = useCallback((plano) => {
    setSelectedPlano(plano);
    setModalVisible(true);
  }, []);

  const handlePeriodoChange = useCallback((periodo) => {
    setSelectedPeriodo(periodo);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedPlano(null);
  }, []);

  // Estatísticas do período
  const estatisticasPeriodo = useMemo(() => {
    const planos = planosData.planos[selectedPeriodo] || [];
    const total = planos.length;
    const concluidos = planos.filter(p => p.status === 'Concluída').length;
    const planejados = planos.filter(p => p.status === 'Planejada').length;
    const percentualConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    return { total, concluidos, planejados, percentualConcluido };
  }, [planosData.planos, selectedPeriodo]);

  // Helper functions
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'Concluída': return '#10b981';
      case 'Planejada': return '#3b82f6';
      case 'Em Andamento': return '#f59e0b';
      default: return '#6b7280';
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }, []);

  // Render components
  const renderPeriodSelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.periodSelector}
    >
      {planosData.periodos.map((periodo) => (
        <TouchableOpacity
          key={periodo}
          style={[
            styles.periodButton,
            selectedPeriodo === periodo && styles.activePeriodButton
          ]}
          onPress={() => handlePeriodoChange(periodo)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriodo === periodo && styles.activePeriodButtonText
          ]}>
            {periodo}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSummaryCard = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.sectionTitle}>Resumo do {selectedPeriodo}</Text>
      <View style={styles.summaryContent}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconContainer, { backgroundColor: materiaConfig.cor + '20' }]}>
            <Ionicons name="document-text" size={24} color={materiaConfig.cor} />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryValue}>{estatisticasPeriodo.total}</Text>
            <Text style={styles.summaryLabel}>Total de Planos</Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconContainer, { backgroundColor: '#10b981' + '20' }]}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryValue}>{estatisticasPeriodo.concluidos}</Text>
            <Text style={styles.summaryLabel}>Concluídos</Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIconContainer, { backgroundColor: '#3b82f6' + '20' }]}>
            <Ionicons name="time" size={24} color="#3b82f6" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryValue}>{estatisticasPeriodo.percentualConcluido}%</Text>
            <Text style={styles.summaryLabel}>Progresso</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPlanoItem = useCallback(({ item }) => (
    <TouchableOpacity style={styles.planoItem} onPress={() => handlePlanoPress(item)}>
      <View style={styles.planoHeader}>
        <View style={styles.planoInfo}>
          <Text style={styles.planoTitulo}>{item.titulo}</Text>
          <Text style={styles.planoData}>{formatDate(item.data)} • {item.duracao}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.planoDetails}>
        <Text style={styles.planoConteudo} numberOfLines={2}>
          {item.conteudo}
        </Text>
        <View style={styles.planoMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="target" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.objetivos.length} objetivos</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="layers" size={14} color="#6b7280" />
            <Text style={styles.metaText}>{item.recursos.length} recursos</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [handlePlanoPress, formatDate, getStatusColor]);

  const renderPlanoModal = () => {
    if (!selectedPlano) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Header fixo */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={2}>
                  {selectedPlano.titulo}
                </Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              {/* Conteúdo scrollável */}
              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalBodyContent}
              >
                {/* Info Básica */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Informações Gerais</Text>
                  <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Data</Text>
                        <Text style={styles.infoValue}>{formatDate(selectedPlano.data)}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Duração</Text>
                        <Text style={styles.infoValue}>{selectedPlano.duracao}</Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <View style={[styles.statusBadgeModal, { backgroundColor: getStatusColor(selectedPlano.status) + '20' }]}>
                          <Text style={[styles.statusTextModal, { color: getStatusColor(selectedPlano.status) }]}>
                            {selectedPlano.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Objetivos */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Objetivos de Aprendizagem</Text>
                  <View style={styles.objetivosContainer}>
                    {selectedPlano.objetivos.map((objetivo, index) => (
                      <View key={index} style={styles.objetivoItem}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={materiaConfig.cor} />
                        <Text style={styles.objetivoText}>{objetivo}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Conteúdo */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Conteúdo</Text>
                  <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{selectedPlano.conteudo}</Text>
                  </View>
                </View>

                {/* Metodologia */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Metodologia</Text>
                  <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{selectedPlano.metodologia}</Text>
                  </View>
                </View>

                {/* Recursos */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Recursos Necessários</Text>
                  <View style={styles.recursosContainer}>
                    {selectedPlano.recursos.map((recurso, index) => (
                      <View key={index} style={styles.recursoTag}>
                        <Text style={styles.recursoText}>{recurso}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Avaliação */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Avaliação</Text>
                  <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{selectedPlano.avaliacao}</Text>
                  </View>
                </View>

                {/* Observações */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Observações</Text>
                  <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{selectedPlano.observacoes}</Text>
                  </View>
                </View>

                {/* Feedback (se houver) */}
                {selectedPlano.feedback && (
                  <View style={[styles.modalSection, { marginBottom: 0 }]}>
                    <Text style={styles.modalSectionTitle}>Feedback da Aula</Text>
                    <View style={[styles.contentContainer, styles.feedbackContainer]}>
                      <Text style={styles.contentText}>{selectedPlano.feedback}</Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const currentPlanos = planosData.planos[selectedPeriodo] || [];

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
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Planos de {materia}</Text>
          <Text style={styles.headerSubtitle}>{planosData.professor} • {planosData.turma}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
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
        {/* Period Selector */}
        {renderPeriodSelector()}

        {/* Summary Card */}
        {renderSummaryCard()}

        {/* Planos List */}
        <View style={styles.planosContainer}>
          <Text style={styles.sectionTitle}>Planos de Aula</Text>
          {currentPlanos.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>
                Nenhum plano de aula encontrado para este período
              </Text>
            </View>
          ) : (
            <FlatList
              data={currentPlanos}
              renderItem={renderPlanoItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Plano Detail Modal */}
      {renderPlanoModal()}
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
  headerContent: {
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e0e7ff',
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  periodSelector: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  activePeriodButton: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  activePeriodButtonText: {
    color: '#fff',
  },
  summaryContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e3a8a',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryTextContainer: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  planosContainer: {
    margin: 20,
    marginTop: 0,
  },
  planoItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  planoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planoInfo: {
    flex: 1,
    marginRight: 12,
  },
  planoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  planoData: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  planoDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  planoConteudo: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  planoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
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
  // Modal Styles - Corrigidos
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: screenHeight * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
    marginRight: 16,
    lineHeight: 24,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 12,
  },
  // Info Container - Corrigido
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadgeModal: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusTextModal: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // Objetivos Container
  objetivosContainer: {
    gap: 12,
  },
  objetivoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  objetivoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  // Content Container
  contentContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  // Recursos Container
  recursosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recursoTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  recursoText: {
    fontSize: 12,
    color: '#3730a3',
    fontWeight: '500',
  },
  // Feedback Container
  feedbackContainer: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
});