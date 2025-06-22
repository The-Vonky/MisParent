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

export default function StudentProfile({ route }) {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('eventos');
  const [loading, setLoading] = useState(false);

  // Get student ID from route params if available
  const studentId = route?.params?.studentId;

  // Enhanced mock data with error handling
  const studentData = useMemo(() => ({
    id: studentId || '1',
    name: 'James Junior',
    class: '2 - A',
    teacher: 'Ana Carolina',
    modality: 'Integral',
    avatar: 'https://www.pintarcolorir.com.br/wp-content/uploads/2015/04/Desenhos-para-colorir-de-alunos-01-172x159.jpg',
    stats: {
      attendance: '95%',
      grades: '8.5',
      activities: '12'
    },
    phone: '+55 11 99999-9999',
    email: 'jamesJunior@escola.com',
    birthDate: '2010-05-15',
    address: 'Rua das Flores, 123 - São Paulo, SP'
  }), [studentId]);

  const events = useMemo(() => [
    { 
      id: '1', 
      title: 'Reunião de Pais', 
      date: '2025-06-20',
      time: '19:00',
      type: 'meeting',
      description: 'Reunião para discussão do desenvolvimento escolar',
      location: 'Sala 5 - Bloco A'
    },
    { 
      id: '2', 
      title: 'Feriado - Corpus Christi', 
      date: '2025-06-19',
      type: 'holiday',
      description: 'Não haverá aulas'
    },
    { 
      id: '3', 
      title: 'Festa Junina', 
      date: '2025-06-24',
      time: '14:00',
      type: 'event',
      description: 'Festa tradicional da escola',
      location: 'Quadra Principal'
    },
    { 
      id: '4', 
      title: 'Entrega de Boletins', 
      date: '2025-06-30',
      time: '18:00',
      type: 'meeting',
      description: 'Entrega do boletim do 2º bimestre',
      location: 'Sala de Aula'
    },
  ], []);

  const activities = useMemo(() => [
    {
      id: '1',
      subject: 'Matemática',
      title: 'Exercícios de Frações',
      date: '2025-06-10',
      dueDate: '2025-06-17',
      status: 'completed',
      grade: '9.0',
      description: 'Lista de exercícios sobre frações equivalentes'
    },
    {
      id: '2',
      subject: 'Português',
      title: 'Redação sobre Meio Ambiente',
      date: '2025-06-12',
      dueDate: '2025-06-19',
      status: 'pending',
      grade: null,
      description: 'Redação dissertativa sobre sustentabilidade'
    },
    {
      id: '3',
      subject: 'Ciências',
      title: 'Projeto Sistema Solar',
      date: '2025-06-15',
      dueDate: '2025-06-22',
      status: 'in_progress',
      grade: null,
      description: 'Maquete do sistema solar'
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

  const handleEventPress = useCallback((event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  }, [navigation]);

  const handleActivityPress = useCallback((activity) => {
    navigation.navigate('ActivityDetails', { activityId: activity.id });
  }, [navigation]);

  // Helper functions
  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting': return 'people-outline';
      case 'holiday': return 'calendar-outline';
      case 'event': return 'star-outline';
      default: return 'calendar-outline';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'meeting': return '#1e3a8a';
      case 'holiday': return '#ef4444';
      case 'event': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'in_progress': return '#1e3a8a';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      default: return 'Indefinido';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays > 0 && diffDays <= 7) return `Em ${diffDays} dias`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Render functions
  const renderEventItem = ({ item }) => {
    const isUpcoming = new Date(item.date) >= new Date();

    return (
      <TouchableOpacity 
        style={[styles.eventItem, !isUpcoming && styles.pastEvent]} 
        onPress={() => handleEventPress(item)}
      >
        <View style={[styles.eventIconContainer, { backgroundColor: getEventColor(item.type) + '20' }]}>
          <Ionicons name={getEventIcon(item.type)} size={20} color={getEventColor(item.type)} />
        </View>
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={[styles.eventDate, !isUpcoming && styles.pastEventText]}>
              {formatDate(item.date)}
            </Text>
          </View>
          <Text style={styles.eventDescription}>{item.description}</Text>
          {item.location && (
            <View style={styles.eventLocationContainer}>
              <Ionicons name="location-outline" size={12} color="#6b7280" />
              <Text style={styles.eventLocation}>{item.location}</Text>
            </View>
          )}
          {item.time && <Text style={styles.eventTime}>Horário: {item.time}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderActivityItem = ({ item }) => {
    const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';

    return (
      <TouchableOpacity 
        style={[styles.activityItem, isOverdue && styles.overdueActivity]} 
        onPress={() => handleActivityPress(item)}
      >
        <View style={styles.activityHeader}>
          <View style={styles.activitySubjectContainer}>
            <Text style={styles.activitySubject}>{item.subject}</Text>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(item.status) + '20' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(item.status) }
              ]}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.activityDate}>
            {new Date(item.date).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <Text style={styles.activityTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.activityDescription}>{item.description}</Text>
        )}
        <View style={styles.activityFooter}>
          {item.dueDate && (
            <Text style={[styles.activityDueDate, isOverdue && styles.overdueText]}>
              Prazo: {new Date(item.dueDate).toLocaleDateString('pt-BR')}
            </Text>
          )}
          {item.grade && <Text style={styles.activityGrade}>Nota: {item.grade}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    if (selectedTab === 'eventos') {
      const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
      const pastEvents = events.filter(event => new Date(event.date) < new Date());
      const sortedEvents = [...upcomingEvents, ...pastEvents];

      if (sortedEvents.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateText}>Nenhum evento encontrado</Text>
          </View>
        );
      }

      return (
        <FlatList
          data={sortedEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      if (activities.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateText}>Nenhuma atividade encontrada</Text>
          </View>
        );
      }

      return (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      );
    }
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
        <Text style={styles.headerText}>Perfil do Estudante</Text>
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
              <Text style={styles.statValue}>{studentData.stats.attendance}</Text>
              <Text style={styles.statLabel}>Frequência</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{studentData.stats.grades}</Text>
              <Text style={styles.statLabel}>Média</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{studentData.stats.activities}</Text>
              <Text style={styles.statLabel}>Atividades</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('AcessarDiario')}
          >
            <Ionicons name="book-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Acessar Diário</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'eventos' && styles.activeTab]}
            onPress={() => setSelectedTab('eventos')}
          >
            <Text style={[styles.tabText, selectedTab === 'eventos' && styles.activeTabText]}>
              Eventos ({events.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'atividades' && styles.activeTab]}
            onPress={() => setSelectedTab('atividades')}
          >
            <Text style={[styles.tabText, selectedTab === 'atividades' && styles.activeTabText]}>
              Atividades ({activities.length})
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
  eventItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pastEvent: {
    opacity: 0.7,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
  },
  eventDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  pastEventText: {
    textDecorationLine: 'line-through',
  },
  eventDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  eventTime: {
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '600',
  },
  activityItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  overdueActivity: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activitySubjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  activitySubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activityDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDueDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  overdueText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  activityGrade: {
    fontSize: 12,
    color: '#10b981',
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