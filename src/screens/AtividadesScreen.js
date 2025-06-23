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

export default function ActivitiesScreen({ route }) {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('hoje');
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
      totalActivities: '6',
      completedTasks: '4',
      lastUpdate: '27/06'
    },
    phone: '+55 11 99999-9999',
    email: 'maria.eduarda@escola.com'
  }), [studentId]);

  // Atividades de hoje
  const todayActivities = useMemo(() => [
    {
      id: '1',
      title: 'Roda de Conversa',
      type: 'social',
      time: '08:00 - 08:30',
      status: 'completed',
      description: 'Conversa sobre o fim de semana e compartilhamento de experiências',
      teacher: 'Ana Carolina',
      location: 'Sala de Aula',
      materials: ['Almofadas', 'Livro de histórias'],
      completed: true
    },
    {
      id: '2',
      title: 'Atividade de Coordenação Motora',
      type: 'motor',
      time: '09:00 - 09:45',
      status: 'in_progress',
      description: 'Exercícios com bolinhas e obstáculos para desenvolver coordenação',
      teacher: 'Carlos Eduardo',
      location: 'Pátio',
      materials: ['Bolinhas coloridas', 'Cones', 'Colchonetes'],
      completed: false
    },
    {
      id: '3',
      title: 'Lanche da Manhã',
      type: 'meal',
      time: '10:00 - 10:30',
      status: 'upcoming',
      description: 'Momento da alimentação e socialização',
      teacher: 'Ana Carolina',
      location: 'Refeitório',
      materials: [],
      completed: false
    },
    {
      id: '4',
      title: 'Arte e Criatividade',
      type: 'creative',
      time: '10:45 - 11:30',
      status: 'upcoming',
      description: 'Pintura com tinta guache - tema livre',
      teacher: 'Mariana Silva',
      location: 'Sala de Arte',
      materials: ['Tinta guache', 'Pincéis', 'Papel canson', 'Aventais'],
      completed: false
    },
    {
      id: '5',
      title: 'Momento do Descanso',
      type: 'rest',
      time: '12:00 - 13:00',
      status: 'upcoming',
      description: 'Relaxamento e descanso após as atividades da manhã',
      teacher: 'Ana Carolina',
      location: 'Sala de Descanso',
      materials: ['Lençóis', 'Travesseiros', 'Música suave'],
      completed: false
    },
    {
      id: '6',
      title: 'Brincadeira Livre',
      type: 'play',
      time: '15:00 - 16:00',
      status: 'upcoming',
      description: 'Tempo livre para brincadeiras e interação social',
      teacher: 'Carlos Eduardo',
      location: 'Playground',
      materials: ['Brinquedos diversos'],
      completed: false
    }
  ], []);

  // Tarefas da semana
  const weekTasks = useMemo(() => [
    {
      id: '1',
      title: 'Desenho da Família',
      subject: 'Arte',
      dueDate: '2025-06-28',
      status: 'completed',
      priority: 'normal',
      description: 'Fazer um desenho da sua família usando lápis de cor',
      submittedDate: '2025-06-27',
      feedback: 'Muito criativo! Parabéns pelo capricho com as cores.',
      grade: null
    },
    {
      id: '2',
      title: 'Trazer Objeto que Começa com A',
      subject: 'Linguagem',
      dueDate: '2025-06-29',
      status: 'pending',
      priority: 'high',
      description: 'Trazer um objeto de casa que comece com a letra A para nossa roda de conversa',
      submittedDate: null,
      feedback: null,
      grade: null
    },
    {
      id: '3',
      title: 'Cuidar da Plantinha',
      subject: 'Ciências',
      dueDate: '2025-07-01',
      status: 'in_progress',
      priority: 'normal',
      description: 'Regar e observar o crescimento da plantinha que levamos para casa',
      submittedDate: null,
      feedback: null,
      grade: null
    },
    {
      id: '4',
      title: 'História em Família',
      subject: 'Linguagem',
      dueDate: '2025-07-03',
      status: 'pending',
      priority: 'normal',
      description: 'Pedir para um familiar contar uma história da infância dele',
      submittedDate: null,
      feedback: null,
      grade: null
    }
  ], []);

  // Enhanced handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
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

  const handleActivityPress = useCallback((activity) => {
    Alert.alert(
      activity.title,
      `${activity.description}\n\nProfessor(a): ${activity.teacher}\nLocal: ${activity.location}${activity.materials.length > 0 ? `\nMateriais: ${activity.materials.join(', ')}` : ''}`,
      [{ text: 'Fechar', style: 'cancel' }]
    );
  }, []);

  const handleTaskPress = useCallback((task) => {
    let message = `${task.description}\n\nData limite: ${formatDate(task.dueDate)}`;
    
    if (task.status === 'completed' && task.feedback) {
      message += `\n\nFeedback da professora:\n${task.feedback}`;
    }

    Alert.alert(
      task.title,
      message,
      [{ text: 'Fechar', style: 'cancel' }]
    );
  }, []);

  // Helper functions
  const getActivityStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'upcoming': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getActivityStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em andamento';
      case 'upcoming': return 'Aguardando';
      default: return 'N/A';
    }
  };

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case 'social': return 'people-outline';
      case 'motor': return 'fitness-outline';
      case 'meal': return 'restaurant-outline';
      case 'creative': return 'color-palette-outline';
      case 'rest': return 'bed-outline';
      case 'play': return 'happy-outline';
      default: return 'school-outline';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTaskStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em andamento';
      case 'pending': return 'Pendente';
      default: return 'N/A';
    }
  };

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'normal': return '#6b7280';
      case 'low': return '#10b981';
      default: return '#6b7280';
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

  const formatTime = (timeString) => {
    return timeString;
  };

  // Filtered data
  const pendingTasks = useMemo(() => 
    weekTasks.filter(task => task.status === 'pending' || task.status === 'in_progress'), 
    [weekTasks]
  );

  const completedTasks = useMemo(() => 
    weekTasks.filter(task => task.status === 'completed'), 
    [weekTasks]
  );

  // Render functions
  const renderActivityItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.activityItem} 
      onPress={() => handleActivityPress(item)}
    >
      <View style={[styles.activityIconContainer, { backgroundColor: getActivityStatusColor(item.status) + '20' }]}>
        <Ionicons name={getActivityTypeIcon(item.type)} size={20} color={getActivityStatusColor(item.status)} />
      </View>
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getActivityStatusColor(item.status) }
          ]}>
            <Text style={styles.statusText}>{getActivityStatusText(item.status)}</Text>
          </View>
        </View>
        <Text style={styles.activityTime}>{formatTime(item.time)}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <View style={styles.activityFooter}>
          <Text style={styles.activityTeacher}>Prof. {item.teacher}</Text>
          <Text style={styles.activityLocation}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTaskItem = ({ item }) => {
    const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'completed';
    
    return (
      <TouchableOpacity 
        style={[styles.taskItem, isOverdue && styles.overdueTask]} 
        onPress={() => handleTaskPress(item)}
      >
        <View style={[styles.taskIconContainer, { backgroundColor: getTaskStatusColor(item.status) + '20' }]}>
          <Ionicons name="clipboard-outline" size={20} color={getTaskStatusColor(item.status)} />
        </View>
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <View style={styles.taskBadges}>
              {item.priority === 'high' && (
                <View style={[styles.priorityBadge, { backgroundColor: getTaskPriorityColor(item.priority) }]}>
                  <Ionicons name="flag" size={10} color="white" />
                </View>
              )}
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getTaskStatusColor(item.status) }
              ]}>
                <Text style={styles.statusText}>{getTaskStatusText(item.status)}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.taskSubject}>{item.subject}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
          <View style={styles.taskFooter}>
            <Text style={[styles.taskDueDate, isOverdue && styles.overdueDateText]}>
              Prazo: {formatDate(item.dueDate)}
            </Text>
            {item.status === 'completed' && item.submittedDate && (
              <Text style={styles.taskSubmittedDate}>
                Entregue em: {formatDate(item.submittedDate)}
              </Text>
            )}
          </View>
          {item.feedback && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{item.feedback}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    let dataToRender = [];
    let renderItem = null;
    
    if (selectedTab === 'hoje') {
      dataToRender = todayActivities;
      renderItem = renderActivityItem;
    } else {
      dataToRender = weekTasks;
      renderItem = renderTaskItem;
    }

    if (dataToRender.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name={selectedTab === 'hoje' ? 'calendar-outline' : 'clipboard-outline'} size={48} color="#9ca3af" />
          <Text style={styles.emptyStateText}>
            {selectedTab === 'hoje' ? 'Nenhuma atividade para hoje' : 'Nenhuma tarefa encontrada'}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={dataToRender}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    );
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
        <Text style={styles.headerText}>Atividades e Tarefas</Text>
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
              <Text style={styles.statValue}>{studentData.stats.totalActivities}</Text>
              <Text style={styles.statLabel}>Atividades</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#10b981' }]}>{studentData.stats.completedTasks}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
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

        {/* Pending Tasks Alert */}
        {pendingTasks.length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={24} color="#f59e0b" />
              <Text style={styles.alertTitle}>Tarefas Pendentes</Text>
            </View>
            <Text style={styles.alertText}>
              {pendingTasks.length} tarefa(s) aguardando conclusão
            </Text>
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={() => setSelectedTab('tarefas')}
            >
              <Ionicons name="clipboard" size={20} color="white" />
              <Text style={styles.alertButtonText}>Ver Tarefas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'hoje' && styles.activeTab]}
            onPress={() => setSelectedTab('hoje')}
          >
            <Text style={[styles.tabText, selectedTab === 'hoje' && styles.activeTabText]}>
              Hoje ({todayActivities.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'tarefas' && styles.activeTab]}
            onPress={() => setSelectedTab('tarefas')}
          >
            <Text style={[styles.tabText, selectedTab === 'tarefas' && styles.activeTabText]}>
              Tarefas ({weekTasks.length})
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
  alertButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  alertButtonText: {
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
  // Activity styles
  activityItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
  },
  activityTime: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
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
  },
  activityTeacher: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  // Task styles
  taskItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  overdueTask: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    flex: 1,
  },
  taskBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  taskSubject: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  taskFooter: {
    marginBottom: 8,
  },
  taskDueDate: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  overdueDateText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  taskSubmittedDate: {
    fontSize: 12,
    color: '#10b981',
  },
  feedbackContainer: {
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1e3a8a',
  },
  feedbackText: {
    fontSize: 12,
    color: '#1e3a8a',
    fontStyle: 'italic',
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
  },
// Empty state styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  
  // Error styles
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#991b1b',
    marginBottom: 12,
  },
  errorButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  errorButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Success styles
  successContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 4,
  },
  successText: {
    fontSize: 14,
    color: '#047857',
  },
  
  // Floating action button
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  
  // Progress bar styles
  progressContainer: {
    backgroundColor: '#f3f4f6',
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#1e3a8a',
  },
  modalButtonSecondary: {
    backgroundColor: '#e5e7eb',
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  modalButtonTextPrimary: {
    color: 'white',
  },
  modalButtonTextSecondary: {
    color: '#374151',
  },
  
  // Skeleton loading styles
  skeletonContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  skeletonShimmer: {
    backgroundColor: '#e5e7eb',
    height: '100%',
    opacity: 0.7,
  },
  
  // Notification styles
  notificationContainer: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  notificationCloseButton: {
    padding: 4,
  },
  
  // Badge styles
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Chip styles
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  chip: {
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#1e3a8a',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextActive: {
    color: 'white',
  },
  
  // Divider styles
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  dividerWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 12,
    color: '#6b7280',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  
  // Swipe actions
  swipeAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  swipeActionDelete: {
    backgroundColor: '#ef4444',
  },
  swipeActionComplete: {
    backgroundColor: '#10b981',
  },
  swipeActionEdit: {
    backgroundColor: '#f59e0b',
  },
  swipeActionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  
  // Animation styles
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
  slideInRight: {
    transform: [{ translateX: 0 }],
  },
  slideOutRight: {
    transform: [{ translateX: 300 }],
  },
  
  // Accessibility styles
  accessibilityLabel: {
    position: 'absolute',
    left: -10000,
    top: -10000,
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  
  // Print styles (for when content is shared/exported)
  printContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  printTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  printSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
  },
  printSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  printText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
});