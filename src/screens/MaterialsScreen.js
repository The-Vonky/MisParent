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
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MaterialsScreen({ route }) {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('essenciais');
  const [loading, setLoading] = useState(false);

  // Get student ID from route params if available
  const studentId = route?.params?.studentId;

  // Enhanced mock data with error handling
  const studentData = useMemo(() => ({
    id: studentId || '1',
    name: 'James Júnior',
    class: 'Maternal II',
    teacher: 'Ana Carolina',
    modality: 'Integral',
    avatar: 'https://www.pintarcolorir.com.br/wp-content/uploads/2015/04/Desenhos-para-colorir-de-alunos-01-172x159.jpg',
    stats: {
      totalMaterials: '8',
      criticalItems: '2',
      lastUpdate: '27/06'
    },
    phone: '+55 11 99999-9999',
    email: 'maria.eduarda@escola.com',
    birthDate: '2020-03-10',
    address: 'Rua das Flores, 123 - São Paulo, SP'
  }), [studentId]);

  // Lista de materiais com status
  const materials = useMemo(() => [
    {
      id: '1',
      name: 'Fraldas',
      category: 'Higiene',
      status: 'low',
      quantity: '2 unidades',
      lastUpdate: '2025-06-27',
      essential: true,
      description: 'Necessário para o dia a dia da criança',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Pasta de Dente',
      category: 'Higiene',
      status: 'missing',
      quantity: '0 unidades',
      lastUpdate: '2025-06-26',
      essential: true,
      description: 'Para higiene bucal após as refeições',
      priority: 'critical'
    },
    {
      id: '3',
      name: 'Escova de Dente',
      category: 'Higiene',
      status: 'ok',
      quantity: '1 unidade',
      lastUpdate: '2025-06-25',
      essential: true,
      description: 'Para escovação dos dentes',
      priority: 'normal'
    },
    {
      id: '4',
      name: 'Toalha de Rosto',
      category: 'Higiene',
      status: 'ok',
      quantity: '2 unidades',
      lastUpdate: '2025-06-24',
      essential: false,
      description: 'Para secar o rosto após as atividades',
      priority: 'normal'
    },
    {
      id: '5',
      name: 'Roupas Extras',
      category: 'Vestuário',
      status: 'low',
      quantity: '1 conjunto',
      lastUpdate: '2025-06-27',
      essential: true,
      description: 'Para troca em caso de necessidade',
      priority: 'high'
    },
    {
      id: '6',
      name: 'Lençol',
      category: 'Descanso',
      status: 'ok',
      quantity: '1 unidade',
      lastUpdate: '2025-06-20',
      essential: false,
      description: 'Para o momento do descanso',
      priority: 'normal'
    },
    {
      id: '7',
      name: 'Travesseiro',
      category: 'Descanso',
      status: 'ok',
      quantity: '1 unidade',
      lastUpdate: '2025-06-20',
      essential: false,
      description: 'Para maior conforto no descanso',
      priority: 'normal'
    },
    {
      id: '8',
      name: 'Protetor Solar',
      category: 'Cuidados',
      status: 'low',
      quantity: '30ml restante',
      lastUpdate: '2025-06-26',
      essential: true,
      description: 'Para atividades ao ar livre',
      priority: 'high'
    },
  ], []);

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

  const handleContactPress = useCallback(() => {
    Alert.alert(
      'Contato',
      `Telefone: ${studentData.phone}\nEmail: ${studentData.email}`,
      [
        { text: 'Fechar', style: 'cancel' },
        { text: 'Ligar', onPress: () => {/* Handle phone call */} },
        { text: 'Email', onPress: () => {/* Handle email */} }
      ]
    );
  }, [studentData]);

  const handleMaterialPress = useCallback((material) => {
    navigation.navigate('MaterialDetails', { materialId: material.id });
  }, [navigation]);

  const handleRequestMeeting = useCallback(() => {
    Alert.alert(
      'Solicitar Reunião',
      'Deseja solicitar uma reunião com a professora para conversar sobre os materiais?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Solicitar', 
          onPress: () => {
            Alert.alert('Sucesso', 'Solicitação de reunião enviada!');
          }
        },
      ]
    );
  }, []);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return '#10b981';
      case 'low': return '#f59e0b';
      case 'missing': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ok': return 'Suficiente';
      case 'low': return 'Pouco';
      case 'missing': return 'Faltando';
      default: return 'N/A';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return 'checkmark-circle';
      case 'low': return 'warning';
      case 'missing': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Higiene': return 'water-outline';
      case 'Vestuário': return 'shirt-outline';
      case 'Descanso': return 'bed-outline';
      case 'Cuidados': return 'shield-outline';
      default: return 'cube-outline';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filtered materials
  const criticalMaterials = useMemo(() => 
    materials.filter(item => 
      (item.status === 'missing' || item.status === 'low') && item.essential
    ), [materials]
  );

  const essentialMaterials = useMemo(() => 
    materials.filter(item => item.essential), [materials]
  );

  const optionalMaterials = useMemo(() => 
    materials.filter(item => !item.essential), [materials]
  );

  // Render functions
  const renderMaterialItem = ({ item }) => {
    const isCritical = (item.status === 'missing' || item.status === 'low') && item.essential;

    return (
      <TouchableOpacity 
        style={[styles.materialItem, isCritical && styles.criticalMaterial]} 
        onPress={() => handleMaterialPress(item)}
      >
        <View style={[styles.materialIconContainer, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons name={getCategoryIcon(item.category)} size={20} color={getStatusColor(item.status)} />
        </View>
        <View style={styles.materialContent}>
          <View style={styles.materialHeader}>
            <Text style={styles.materialTitle}>{item.name}</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(item.status) }
            ]}>
              <Ionicons 
                name={getStatusIcon(item.status)} 
                size={12} 
                color="white" 
              />
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
          <Text style={styles.materialCategory}>{item.category}</Text>
          <Text style={styles.materialDescription}>{item.description}</Text>
          <View style={styles.materialFooter}>
            <Text style={styles.materialQuantity}>Quantidade: {item.quantity}</Text>
            <Text style={styles.materialUpdate}>
              Atualizado em: {formatDate(item.lastUpdate)}
            </Text>
          </View>
          {item.essential && (
            <View style={styles.essentialBadge}>
              <Text style={styles.essentialText}>Essencial</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    let dataToRender = [];
    
    if (selectedTab === 'essenciais') {
      dataToRender = essentialMaterials;
    } else {
      dataToRender = optionalMaterials;
    }

    if (dataToRender.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={48} color="#9ca3af" />
          <Text style={styles.emptyStateText}>Nenhum material encontrado</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={dataToRender}
        renderItem={renderMaterialItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar with blue background and light text */}
      <StatusBar backgroundColor="#1e3a8a" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Materiais Escolares</Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
          <Ionicons name="call-outline" size={24} color="#fff" />
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
        {/* Profile Card */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: studentData.avatar }}
              style={styles.profileImage}
              onError={() => {
                console.log('Failed to load profile image');
              }}
            />
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{studentData.name}</Text>
            <Text style={styles.profileClass}>Turma {studentData.class}</Text>
            <Text style={styles.profileTeacher}>Prof. {studentData.teacher} • {studentData.modality}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{studentData.stats.totalMaterials}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#ef4444' }]}>{studentData.stats.criticalItems}</Text>
              <Text style={styles.statLabel}>Críticos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{studentData.stats.lastUpdate}</Text>
              <Text style={styles.statLabel}>Última Atualização</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('MessagesModal')}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Conversar com a Professora</Text>
          </TouchableOpacity>
        </View>

        {/* Critical Materials Alert */}
        {criticalMaterials.length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={24} color="#f59e0b" />
              <Text style={styles.alertTitle}>Atenção Necessária</Text>
            </View>
            <Text style={styles.alertText}>
              {criticalMaterials.length} material(is) essencial(is) precisam ser repostos
            </Text>
            <TouchableOpacity 
              style={styles.meetingButton}
              onPress={handleRequestMeeting}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={styles.meetingButtonText}>Solicitar Reunião</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'essenciais' && styles.activeTab]}
            onPress={() => setSelectedTab('essenciais')}
          >
            <Text style={[styles.tabText, selectedTab === 'essenciais' && styles.activeTabText]}>
              Essenciais ({essentialMaterials.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'opcionais' && styles.activeTab]}
            onPress={() => setSelectedTab('opcionais')}
          >
            <Text style={[styles.tabText, selectedTab === 'opcionais' && styles.activeTabText]}>
              Opcionais ({optionalMaterials.length})
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
  contactButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#1e3a8a',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 2,
  },
  profileTeacher: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertSection: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 12,
  },
  meetingButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  meetingButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
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
  },
  activeTab: {
    backgroundColor: '#1e3a8a',
  },
  tabText: {
    fontSize: 14,
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
  materialItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  criticalMaterial: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  materialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  materialContent: {
    flex: 1,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  materialCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  materialDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  materialFooter: {
    marginBottom: 8,
  },
  materialQuantity: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  materialUpdate: {
    fontSize: 12,
    color: '#6b7280',
  },
  essentialBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  essentialText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
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