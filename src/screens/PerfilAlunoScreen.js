import { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  RefreshControl,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StudentProfile({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('eventos');
  const [loading, setLoading] = useState(false);

  // Get student ID from route params if available
  const studentId = route?.params?.studentId;

  // Enhanced mock data with error handling
  const studentData = useMemo(() => ({
    id: studentId || '1',
    name: 'Lucas Oliveira',
    class: '2A',
    teacher: 'Ana Silva',
    modality: 'Integral',
    avatar: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2017/07/Sir-Ian-McKellen-as-Gandalf-The-Grey-The-Shire-Lord-of-the-Rings-Peter-Jackson.jpg',
    stats: {
      attendance: '95%',
      grades: '8.5',
      activities: '12'
    },
    // Add more student details
    phone: '+55 11 99999-9999',
    email: 'lucas.oliveira@escola.com',
    birthDate: '2010-05-15',
    address: 'Rua das Flores, 123 - São Paulo, SP'
  }), [studentId]);

  const events = useMemo(() => [
    { 
      id: '1', 
      title: 'Reunião de Pais', 
      date: '2025-06-20', // Updated to future date
      time: '19:00',
      type: 'meeting',
      description: 'Reunião para discussão do desenvolvimento escolar',
      location: 'Sala 5 - Bloco A'
    },
    { 
      id: '2', 
      title: 'Feriado - Corpus Christi', 
      date: '2025-06-19', // Updated to actual 2025 date
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

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleDiaryPress = useCallback(() => {
    navigation.navigate('Diary', { 
      studentId: studentData.id,
      studentName: studentData.name 
    });
  }, [navigation, studentData]);

  const handleTabPress = useCallback((tab) => {
    setSelectedTab(tab);
  }, []);

  const handleEventPress = useCallback((event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  }, [navigation]);

  const handleActivityPress = useCallback((activity) => {
    navigation.navigate('ActivityDetails', { activityId: activity.id });
  }, [navigation]);

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

  // Enhanced render functions
  const renderEventItem = useCallback(({ item }) => {
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
        case 'meeting': return '#3b82f6';
        case 'holiday': return '#ef4444';
        case 'event': return '#10b981';
        default: return '#6b7280';
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

    const isUpcoming = new Date(item.date) >= new Date();

    return (
      <TouchableOpacity 
        style={[styles.eventItem, !isUpcoming && styles.pastEvent]} 
        onPress={() => handleEventPress(item)}
      >
        <View style={[styles.eventIconContainer, { backgroundColor: getEventColor(item.type) + '20' }]}>
          <Ionicons name={getEventIcon(item.type)} size={24} color={getEventColor(item.type)} />
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription}>{item.description}</Text>
          {item.location && (
            <View style={styles.eventLocationContainer}>
              <Ionicons name="location-outline" size={12} color="#9ca3af" />
              <Text style={styles.eventLocation}>{item.location}</Text>
            </View>
          )}
          <View style={styles.eventDateContainer}>
            <Text style={[styles.eventDate, !isUpcoming && styles.pastEventText]}>
              {formatDate(item.date)}
            </Text>
            {item.time && <Text style={styles.eventTime}>{item.time}</Text>}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  }, [handleEventPress]);

  const renderActivityItem = useCallback(({ item }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return '#10b981';
        case 'pending': return '#f59e0b';
        case 'in_progress': return '#3b82f6';
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

    const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';

    return (
      <TouchableOpacity 
        style={[styles.activityItem, isOverdue && styles.overdueActivity]} 
        onPress={() => handleActivityPress(item)}
      >
        <View style={styles.activityHeader}>
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
        <Text style={styles.activityTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.activityDescription}>{item.description}</Text>
        )}
        <View style={styles.activityFooter}>
          <View>
            <Text style={styles.activityDate}>
              Criado: {new Date(item.date).toLocaleDateString('pt-BR')}
            </Text>
            {item.dueDate && (
              <Text style={[styles.activityDueDate, isOverdue && styles.overdueText]}>
                Prazo: {new Date(item.dueDate).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>
          {item.grade && <Text style={styles.activityGrade}>Nota: {item.grade}</Text>}
        </View>
      </TouchableOpacity>
    );
  }, [handleActivityPress]);

  const renderTabContent = () => {
    if (selectedTab === 'eventos') {
      const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
      const pastEvents = events.filter(event => new Date(event.date) < new Date());
      const sortedEvents = [...upcomingEvents, ...pastEvents];

      return (
        <FlatList
          data={sortedEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>Nenhum evento encontrado</Text>
            </View>
          )}
        />
      );
    } else {
      return (
        <FlatList
          data={activities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>Nenhuma atividade encontrada</Text>
            </View>
          )}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Estudante</Text>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
          <Ionicons name="call-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: studentData.avatar }}
              style={styles.profileImage}
              onError={() => {
                // Handle image loading error
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

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.diaryButton} onPress={() => navigation.navigate('AcessarDiario')}>
              <Ionicons name="book-outline" size={20} color="white" />
              <Text style={styles.diaryButtonText}>Acessar Diário</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'eventos' && styles.activeTab]}
            onPress={() => handleTabPress('eventos')}
          >
            <Text style={[styles.tabText, selectedTab === 'eventos' && styles.activeTabText]}>
              Eventos ({events.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'atividades' && styles.activeTab]}
            onPress={() => handleTabPress('atividades')}
          >
            <Text style={[styles.tabText, selectedTab === 'atividades' && styles.activeTabText]}>
              Atividades ({activities.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#3b82f6',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  contactButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    borderColor: '#3b82f6',
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
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
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
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
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
  actionButtonsContainer: {
    gap: 12,
  },
  diaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  diaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  eventItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pastEvent: {
    opacity: 0.7,
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  pastEventText: {
    textDecorationLine: 'line-through',
  },
  eventTime: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  activityItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  overdueActivity: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activitySubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  activityDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  activityDueDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
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
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
});