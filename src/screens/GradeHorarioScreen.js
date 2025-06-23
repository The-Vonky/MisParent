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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ScheduleScreen({ route }) {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get student ID from route params if available
  const studentId = route?.params?.studentId;

  // Student data
  const studentData = useMemo(() => ({
    id: studentId || '1',
    name: 'James Júnior',
    class: 'Maternal II',
    teacher: 'Ana Carolina',
    modality: 'Integral',
    avatar: 'https://www.pintarcolorir.com.br/wp-content/uploads/2015/04/Desenhos-para-colorir-de-alunos-01-172x159.jpg',
    stats: {
      totalClasses: '25',
      weeklyHours: '40h',
      nextClass: 'Matemática'
    },
    phone: '+55 11 99999-9999',
    email: 'jamesJunior@escola.com',
  }), [studentId]);

  // Days of the week
  const daysOfWeek = [
    { key: 'segunda', label: 'SEG', fullName: 'Segunda-feira' },
    { key: 'terca', label: 'TER', fullName: 'Terça-feira' },
    { key: 'quarta', label: 'QUA', fullName: 'Quarta-feira' },
    { key: 'quinta', label: 'QUI', fullName: 'Quinta-feira' },
    { key: 'sexta', label: 'SEX', fullName: 'Sexta-feira' },
  ];

  // Mock schedule data
  const scheduleData = useMemo(() => ({
    segunda: [
      {
        id: '1',
        subject: 'Matemática',
        teacher: 'Prof. Ana Carolina',
        time: '08:00 - 09:00',
        room: 'Sala 1',
        type: 'regular',
        description: 'Números e operações básicas',
        color: '#3b82f6',
        icon: 'calculator-outline'
      },
      {
        id: '2',
        subject: 'Português',
        teacher: 'Prof. Maria Silva',
        time: '09:00 - 10:00',
        room: 'Sala 1',
        type: 'regular',
        description: 'Alfabetização e leitura',
        color: '#10b981',
        icon: 'book-outline'
      },
      {
        id: '3',
        subject: 'Lanche',
        teacher: '',
        time: '10:00 - 10:30',
        room: 'Refeitório',
        type: 'break',
        description: 'Intervalo para lanche',
        color: '#f59e0b',
        icon: 'restaurant-outline'
      },
      {
        id: '4',
        subject: 'Educação Física',
        teacher: 'Prof. João Santos',
        time: '10:30 - 11:30',
        room: 'Quadra',
        type: 'physical',
        description: 'Atividades psicomotoras',
        color: '#ef4444',
        icon: 'fitness-outline'
      },
      {
        id: '5',
        subject: 'Artes',
        teacher: 'Prof. Carla Oliveira',
        time: '11:30 - 12:30',
        room: 'Ateliê',
        type: 'creative',
        description: 'Pintura e desenho',
        color: '#8b5cf6',
        icon: 'color-palette-outline'
      },
      {
        id: '6',
        subject: 'Almoço',
        teacher: '',
        time: '12:30 - 13:30',
        room: 'Refeitório',
        type: 'break',
        description: 'Hora do almoço',
        color: '#f59e0b',
        icon: 'restaurant-outline'
      },
      {
        id: '7',
        subject: 'Descanso',
        teacher: '',
        time: '13:30 - 14:30',
        room: 'Sala de Descanso',
        type: 'rest',
        description: 'Momento de relaxamento',
        color: '#6b7280',
        icon: 'bed-outline'
      },
      {
        id: '8',
        subject: 'Música',
        teacher: 'Prof. Roberto Costa',
        time: '14:30 - 15:30',
        room: 'Sala de Música',
        type: 'creative',
        description: 'Iniciação musical',
        color: '#f97316',
        icon: 'musical-notes-outline'
      },
    ],
    terca: [
      {
        id: '9',
        subject: 'Ciências',
        teacher: 'Prof. Ana Carolina',
        time: '08:00 - 09:00',
        room: 'Sala 1',
        type: 'regular',
        description: 'Explorando a natureza',
        color: '#059669',
        icon: 'leaf-outline'
      },
      {
        id: '10',
        subject: 'Matemática',
        teacher: 'Prof. Ana Carolina',
        time: '09:00 - 10:00',
        room: 'Sala 1',
        type: 'regular',
        description: 'Formas geométricas',
        color: '#3b82f6',
        icon: 'calculator-outline'
      },
      // ... mais aulas
    ],
    quarta: [
      {
        id: '11',
        subject: 'Português',
        teacher: 'Prof. Maria Silva',
        time: '08:00 - 09:00',
        room: 'Sala 1',
        type: 'regular',
        description: 'Contação de histórias',
        color: '#10b981',
        icon: 'book-outline'
      },
      // ... mais aulas
    ],
    quinta: [
      {
        id: '12',
        subject: 'Educação Física',
        teacher: 'Prof. João Santos',
        time: '08:00 - 09:00',
        room: 'Quadra',
        type: 'physical',
        description: 'Jogos e brincadeiras',
        color: '#ef4444',
        icon: 'fitness-outline'
      },
      // ... mais aulas
    ],
    sexta: [
      {
        id: '13',
        subject: 'Artes',
        teacher: 'Prof. Carla Oliveira',
        time: '08:00 - 09:00',
        room: 'Ateliê',
        type: 'creative',
        description: 'Arte com materiais recicláveis',
        color: '#8b5cf6',
        icon: 'color-palette-outline'
      },
      // ... mais aulas
    ],
  }), []);

  // Get current date info
  const getCurrentDateInfo = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7));
    
    return {
      weekStart,
      weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
      today: today.getDay() === 0 ? 7 : today.getDay() // Convert Sunday from 0 to 7
    };
  };

  const { weekStart, weekEnd, today } = getCurrentDateInfo();

  // Enhanced handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
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

  const handleClassPress = useCallback((classItem) => {
    if (classItem.type === 'break' || classItem.type === 'rest') return;
    
    Alert.alert(
      classItem.subject,
      `Professor: ${classItem.teacher}\nSala: ${classItem.room}\nHorário: ${classItem.time}\n\nDescrição: ${classItem.description}`,
      [
        { text: 'Fechar', style: 'cancel' },
        { text: 'Ver Detalhes', onPress: () => navigation.navigate('ClassDetails', { classId: classItem.id }) }
      ]
    );
  }, [navigation]);

  const handleWeekChange = useCallback((direction) => {
    setCurrentWeek(prev => prev + direction);
  }, []);

  // Helper functions
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const formatWeekRange = () => {
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };

  const isToday = (dayKey) => {
    const dayIndex = daysOfWeek.findIndex(day => day.key === dayKey) + 1;
    return dayIndex === today && currentWeek === 0;
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'break':
        return { backgroundColor: '#fef3c7', borderColor: '#f59e0b' };
      case 'rest':
        return { backgroundColor: '#f3f4f6', borderColor: '#6b7280' };
      case 'physical':
        return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
      case 'creative':
        return { backgroundColor: '#f3e8ff', borderColor: '#8b5cf6' };
      default:
        return { backgroundColor: '#eff6ff', borderColor: '#3b82f6' };
    }
  };

  // Render functions
  const renderClassItem = ({ item }) => {
    const typeStyle = getTypeStyle(item.type);
    
    return (
      <TouchableOpacity 
        style={[styles.classItem, typeStyle]} 
        onPress={() => handleClassPress(item)}
        disabled={item.type === 'break' || item.type === 'rest'}
      >
        <View style={styles.classTimeContainer}>
          <Text style={styles.classTime}>{item.time}</Text>
        </View>
        
        <View style={styles.classContent}>
          <View style={styles.classHeader}>
            <View style={[styles.classIconContainer, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={16} color={item.color} />
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.classSubject}>{item.subject}</Text>
              {item.teacher && (
                <Text style={styles.classTeacher}>{item.teacher}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.classDetails}>
            <Text style={styles.classRoom}>{item.room}</Text>
            <Text style={styles.classDescription}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDaySelector = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {daysOfWeek.map((day, index) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + index);
          
          return (
            <TouchableOpacity
              key={day.key}
              style={[
                styles.dayButton,
                selectedDay === day.key && styles.activeDayButton,
                isToday(day.key) && styles.todayDayButton
              ]}
              onPress={() => setSelectedDay(day.key)}
            >
              <Text style={[
                styles.dayLabel,
                selectedDay === day.key && styles.activeDayLabel,
                isToday(day.key) && styles.todayDayLabel
              ]}>
                {day.label}
              </Text>
              <Text style={[
                styles.dayDate,
                selectedDay === day.key && styles.activeDayDate,
                isToday(day.key) && styles.todayDayDate
              ]}>
                {formatDate(dayDate)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const currentDaySchedule = scheduleData[selectedDay] || [];

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
        <Text style={styles.headerText}>Grade de Horários</Text>
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
              onError={() => console.log('Failed to load profile image')}
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
              <Text style={styles.statValue}>{studentData.stats.totalClasses}</Text>
              <Text style={styles.statLabel}>Aulas/Semana</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{studentData.stats.weeklyHours}</Text>
              <Text style={styles.statLabel}>Horas/Semana</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{studentData.stats.nextClass}</Text>
              <Text style={styles.statLabel}>Próxima Aula</Text>
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

        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={styles.weekButton}
            onPress={() => handleWeekChange(-1)}
          >
            <Ionicons name="chevron-back" size={20} color="#1e3a8a" />
          </TouchableOpacity>
          
          <View style={styles.weekInfo}>
            <Text style={styles.weekRange}>{formatWeekRange()}</Text>
            <Text style={styles.weekLabel}>
              {currentWeek === 0 ? 'Esta semana' : 
               currentWeek === 1 ? 'Próxima semana' : 
               currentWeek === -1 ? 'Semana passada' : 
               `${Math.abs(currentWeek)} semanas ${currentWeek > 0 ? 'à frente' : 'atrás'}`}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.weekButton}
            onPress={() => handleWeekChange(1)}
          >
            <Ionicons name="chevron-forward" size={20} color="#1e3a8a" />
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        {renderDaySelector()}

        {/* Schedule Content */}
        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>
              {daysOfWeek.find(day => day.key === selectedDay)?.fullName}
            </Text>
            <Text style={styles.scheduleSubtitle}>
              {currentDaySchedule.length} {currentDaySchedule.length === 1 ? 'atividade' : 'atividades'}
            </Text>
          </View>

          {currentDaySchedule.length > 0 ? (
            <FlatList
              data={currentDaySchedule}
              renderItem={renderClassItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>Nenhuma atividade programada</Text>
              <Text style={styles.emptyStateSubtext}>
                Não há aulas ou atividades para este dia
              </Text>
            </View>
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
    textAlign: 'center',
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
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  weekButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekRange: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  weekLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  daySelector: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  daySelectorContent: {
    paddingHorizontal: 4,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  activeDayButton: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  todayDayButton: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeDayLabel: {
    color: '#fff',
  },
  todayDayLabel: {
    color: '#10b981',
  },
  dayDate: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  activeDayDate: {
    color: '#cbd5e1',
  },
  todayDayDate: {
    color: '#10b981',
    fontWeight: '600',
  },
  scheduleContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  scheduleHeader: {
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  classItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  classTimeContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  classTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  classContent: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  classTeacher: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  classDetails: {
    marginLeft: 44,
  },
  classRoom: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  classDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  separator: {
    height: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyStateText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});