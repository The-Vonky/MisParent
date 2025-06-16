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
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StudentProfile({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('eventos');

  // Dados mockados - em produção viriam de API/context
  const studentData = {
    name: 'Lucas Oliveira',
    class: '2A',
    teacher: 'Ana Silva',
    modality: 'Integral',
    avatar: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2017/07/Sir-Ian-McKellen-as-Gandalf-The-Grey-The-Shire-Lord-of-the-Rings-Peter-Jackson.jpg',
    stats: {
      attendance: '95%',
      grades: '8.5',
      activities: '12'
    }
  };

  const events = useMemo(() => [
    { 
      id: '1', 
      title: 'Reunião de Pais', 
      date: '2025-03-15',
      time: '19:00',
      type: 'meeting',
      description: 'Reunião para discussão do desenvolvimento escolar'
    },
    { 
      id: '2', 
      title: 'Feriado - Tiradentes', 
      date: '2025-04-21',
      type: 'holiday',
      description: 'Não haverá aulas'
    },
    { 
      id: '3', 
      title: 'Festa Junina', 
      date: '2025-06-24',
      time: '14:00',
      type: 'event',
      description: 'Festa tradicional da escola'
    },
  ], []);

  const activities = useMemo(() => [
    {
      id: '1',
      subject: 'Matemática',
      title: 'Exercícios de Frações',
      date: '2025-03-10',
      status: 'completed',
      grade: '9.0'
    },
    {
      id: '2',
      subject: 'Português',
      title: 'Redação sobre Meio Ambiente',
      date: '2025-03-12',
      status: 'pending',
      grade: null
    },
  ], []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleDiaryPress = useCallback(() => {
    navigation.navigate('Diary', { studentId: studentData.name });
  }, [navigation, studentData.name]);

  const handleTabPress = useCallback((tab) => {
    setSelectedTab(tab);
  }, []);

  // Render functions
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
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    return (
      <TouchableOpacity style={styles.eventItem}>
        <View style={[styles.eventIconContainer, { backgroundColor: getEventColor(item.type) + '20' }]}>
          <Ionicons name={getEventIcon(item.type)} size={24} color={getEventColor(item.type)} />
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription}>{item.description}</Text>
          <View style={styles.eventDateContainer}>
            <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
            {item.time && <Text style={styles.eventTime}>{item.time}</Text>}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </TouchableOpacity>
    );
  }, []);

  const renderActivityItem = useCallback(({ item }) => {
    return (
      <View style={styles.activityItem}>
        <View style={styles.activityHeader}>
          <Text style={styles.activitySubject}>{item.subject}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'completed' ? '#10b98120' : '#f59e0b20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'completed' ? '#10b981' : '#f59e0b' }
            ]}>
              {item.status === 'completed' ? 'Concluído' : 'Pendente'}
            </Text>
          </View>
        </View>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <View style={styles.activityFooter}>
          <Text style={styles.activityDate}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
          {item.grade && <Text style={styles.activityGrade}>Nota: {item.grade}</Text>}
        </View>
      </View>
    );
  }, []);

  const renderTabContent = () => {
    if (selectedTab === 'eventos') {
      return (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header com gradiente simulado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Estudante</Text>
        <View style={styles.headerSpacer} />
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

          {/* Diary Button */}
          <TouchableOpacity style={styles.diaryButton} onPress={handleDiaryPress}>
            <Ionicons name="book-outline" size={20} color="white" />
            <Text style={styles.diaryButtonText}>Acessar Diário</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'eventos' && styles.activeTab]}
            onPress={() => handleTabPress('eventos')}
          >
            <Text style={[styles.tabText, selectedTab === 'eventos' && styles.activeTabText]}>
              Eventos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'atividades' && styles.activeTab]}
            onPress={() => handleTabPress('atividades')}
          >
            <Text style={[styles.tabText, selectedTab === 'atividades' && styles.activeTabText]}>
              Atividades
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
    marginRight: 32,
  },
  headerSpacer: {
    width: 32,
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
    marginBottom: 8,
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
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  activityGrade: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
});